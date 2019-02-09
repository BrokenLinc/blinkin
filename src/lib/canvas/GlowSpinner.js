// Credit: https://codepen.io/jackrugile/pen/Gving

import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withPropsOnChange } from 'recompose';

import dToR from '../util/dToR';
import rint from '../util/rint';
import AnimatedCanvas from './AnimatedCanvas';

const createGradients = ({ ctx, circle }) => {

  const fillGradient = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
  fillGradient.addColorStop(0, 'hsla('+circle.hue+', 60%, 50%, .25)');
  fillGradient.addColorStop(1, 'hsla('+circle.hue+', 60%, 50%, 0)');

  const borderGradient = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
  borderGradient.addColorStop(0, 'hsla('+circle.hue+', 100%, 50%, 0)');
  borderGradient.addColorStop(.1, 'hsla('+circle.hue+', 100%, 100%, .7)');
  borderGradient.addColorStop(1, 'hsla('+circle.hue+', 100%, 50%, 0)');

  const flareGradient = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 30);
  flareGradient.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
  flareGradient.addColorStop(1, 'hsla(330, 50%, 50%, 0)');

  const flareGlowGradient = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 25);
  flareGlowGradient.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
  flareGlowGradient.addColorStop(1, 'hsla(30, 100%, 50%, 0)');

  return {
    fillGradient,
    borderGradient,
    flareGradient,
    flareGlowGradient,
  }
};
const updateCircle = ({ circle }) => {
  circle.rotation = (circle.rotation + circle.speed) % 360;
};
const renderCircle = ({ ctx, circle, fillGradient, borderGradient }) => {
  renderCircleArc({ctx, gradient: fillGradient, ...circle});
  renderCircleArc({
    ctx,
    gradient: borderGradient,
    ...circle,
    radius: circle.radius + (circle.thickness / 2),
    thickness: circle.borderThickness
  });
}
const renderCircleArc = ({ ctx, gradient, radius, thickness, angleStart, angleEnd }) => {
  ctx.beginPath();
  ctx.arc(0, 0, radius, dToR(angleStart), dToR(angleEnd), true);
  ctx.lineWidth = thickness;
  ctx.strokeStyle = gradient;
  ctx.stroke();
};
const renderFlare = ({ ctx, circle, flareGradient, flareGlowGradient }) => {
  ctx.save();

  ctx.rotate(dToR(185));
  renderFlareArc({ ctx, y: circle.radius, gradient: flareGradient, radius: 30 });

  ctx.rotate(dToR(-20));
  ctx.scale(1.5,1); // leading / trailing edge glow, more like a comet
  renderFlareArc({ ctx, y: circle.radius, gradient: flareGlowGradient, radius: 25 });

  ctx.restore();
};
const renderFlareArc = ({ ctx, y, gradient, radius }) => {
  ctx.beginPath();
  ctx.arc(0, y, radius, 0, Math.PI *2, false);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
};
const createParticles = ({ particles, particleMax, circle }) => {
  if(particles.length < particleMax){
    particles.push({
      x: (circle.x + circle.radius * Math.cos(dToR(circle.rotation-85))) + (rint(0, circle.thickness*2) - circle.thickness),
      y: (circle.y + circle.radius * Math.sin(dToR(circle.rotation-85))) + (rint(0, circle.thickness*2) - circle.thickness),
      vx: (rint(0, 100)-50)/1000,
      vy: (rint(0, 100)-50)/1000,
      radius: rint(1, 6)/2,
      alpha: rint(10, 20)/100
    });
  }
};
const updateParticles = ({ particles }) => {
  let i = particles.length;
  while(i--){
    const p = particles[i];
    // add randomness to velocity
    p.vx += (rint(0, 100)-50)/750;
    p.vy += (rint(0, 100)-50)/750;
    // update position
    p.x += p.vx;
    p.y += p.vy;
    // fade out
    p.alpha -= .01;

    // remove particle once it has faded out
    if(p.alpha < .02){
      particles.splice(i, 1)
    }
  }
};
const renderParticles = ({ particles, ctx }) => {
  let i = particles.length;
  while(i--){
    const p = particles[i];
    ctx.beginPath();
    ctx.fillRect(p.x, p.y, p.radius, p.radius);
    ctx.closePath();
    ctx.fillStyle = 'hsla(0, 0%, 100%, '+p.alpha+')'; // white * alpha
  }
};
const clear = ({ ctx, canvasWidth, canvasHeight }) => {
  // leave a trail
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, .1)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalCompositeOperation = 'lighter';
};

const GlowSpinner = compose(
  withPropsOnChange([], () => ({
    data: {
      particles: [],
      particleMax: 100,
      circle: {
        rotation: 0,
        angleStart: 270,
        angleEnd: 90,
        blur: 25,
      },
    },
  })),
  withPropsOnChange(
    ['radius', 'speed', 'hue', 'thickness', 'borderThickness'],
    ({ data, radius, speed, hue, thickness, borderThickness }) => {
      Object.assign(data.circle, { radius, speed, hue, thickness, borderThickness });
    }
  ),
  withHandlers({
    update: ({ color, data }) => ({ canvasHeight, canvasWidth, ctx }) => {
      const { circle } = data;

      ctx.shadowBlur = circle.blur;
      ctx.shadowColor = 'hsla('+circle.hue+', 80%, 60%, 1)';
      ctx.lineCap = 'round';

      Object.assign(data, createGradients({ ctx, circle }));

      circle.x = canvasWidth / 2;
      circle.y = canvasHeight / 2;
    },
    draw: ({ angleSpread, data }) => ({ canvasHeight, canvasWidth, ctx }) => {
      const { circle, particles, particleMax, fillGradient, borderGradient, flareGradient, flareGlowGradient } = data;

      clear({ ctx, canvasWidth, canvasHeight });
      updateCircle({ circle });

      ctx.save();
      ctx.translate(circle.x, circle.y);
      ctx.rotate(dToR(circle.rotation));

      renderCircle({ ctx, circle, fillGradient, borderGradient })
      renderFlare({ ctx, circle, flareGradient, flareGlowGradient });

      ctx.restore();

      createParticles({ particles, particleMax, circle });
      updateParticles({ particles });
      renderParticles({ particles, ctx });
    },
  }),
)(AnimatedCanvas);

GlowSpinner.propTypes = {
  radius: PropTypes.number,
  speed: PropTypes.number,
  hue: PropTypes.number,
  thickness: PropTypes.number,
  borderThickness: PropTypes.number,

  // inherited from AnimatedCanvas
  className: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  height: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.number,
};

GlowSpinner.defaultProps = {
  radius: 90,
  speed: 2,
  hue: 220,
  thickness: 18,
  borderThickness: 2,

  height: 240,
  maxFps: 60,
  width: 240,
};

GlowSpinner.demoProps = {
};

GlowSpinner.knobConfig = {
  radius: {},
  speed: {},
  angleStart: {},
  angleEnd: {},
  hue: {},
  thickness: {},
  borderThickness: {},
  blur: {},
};

export default GlowSpinner;
