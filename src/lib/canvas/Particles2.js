import React from 'react';
import { compose, withHandlers, withProps, withPropsOnChange } from 'recompose';
import PropTypes from 'prop-types';
import each from 'lodash/each';
import color from 'color';

import AnimatedCanvas from './AnimatedCanvas';
import PointSystem from '../util/PointSystem';

const drawCirclePath = ({ ctx, radius, p }) => {
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
};

const drawLinePath = ({ ctx, p, q, color}) => {
  ctx.beginPath();
  if (color) {
    ctx.strokeStyle = color;
  }
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
  ctx.closePath();
};

const getDistanceSquared = ({ p, q }) => {
  return Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2);
};

const Particles2 = compose(
  withProps({
    data: {},
  }),
  withHandlers({
    setup: ({ data, particleDensity }) => ({ canvasHeight, canvasWidth, devicePixelRatio, segmentLength }) => {
      data.pointSystem = new PointSystem({ canvasHeight, canvasWidth, devicePixelRatio, particleDensity, edgeThreshold: segmentLength });
    },
    update: ({ addPointsInRegion, data, particleFill, particleSize }) => ({ canvasHeight, canvasWidth, ctx, devicePixelRatio }) => {
      ctx.fillStyle = particleFill;

      data.pointSystem.setSize({ canvasHeight, canvasWidth, devicePixelRatio, edgeThreshold: particleSize });
    },
    draw: ({ data, particleSize, particleStrokeColor, particleStrokeWidth }) => ({ ctx, canvasHeight, canvasWidth }) => {
      // ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(255,0,0,0)';
      ctx.rect(0, 0, canvasWidth, canvasHeight);
      ctx.fill();
      // ctx.globalCompositeOperation = 'source-over';

      data.pointSystem.tick();

      // conserve state changes
      if(particleStrokeWidth) {
        ctx.strokeStyle = particleStrokeColor;
        ctx.lineWidth = particleStrokeWidth;
      }

      each(data.pointSystem.points, (p) => {
        const radius = particleSize / 2;
        drawCirclePath({ ctx, radius, p });
        ctx.fill();

        if(particleStrokeWidth) {
          ctx.stroke();
        }
      });
    },
  }),
)(AnimatedCanvas);

Particles2.propTypes = {
  particleDensity: PropTypes.number,
  particleFill: PropTypes.string,
  particleSize: PropTypes.number,
  particleStrokeColor: PropTypes.string,
  particleStrokeWidth: PropTypes.number,

  // inherited from AnimatedCanvas
  className: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
};

Particles2.defaultProps = {
  particleDensity: 0.0002,
  particleFill: '#888',
  particleSize: 6,
  particleStrokeColor: 'transparent',
  particleStrokeWidth: 0,
};

Particles2.demoProps = {
  particleFill: '#902',
  particleSize: 20,
  particleStrokeColor: '#f03',
  particleStrokeWidth: 4,
};

Particles2.knobConfig = {
  particleFill: { type: 'color' },
  particleSize: {},
  particleStrokeColor: { type: 'color' },
  particleStrokeWidth: {},
};

export default Particles2;
