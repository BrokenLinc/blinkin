import React from 'react';
import { compose, withHandlers, withProps, withPropsOnChange } from 'recompose';
import PropTypes from 'prop-types';
import { each, filter } from 'lodash';
import color from 'color';

import AnimatedCanvas from './AnimatedCanvas';

class Particle {
  constructor({ x = 0, y = 0, dx = 0, dy = 0 }) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
  tick({ x1, y1, x2, y2 }) {
    this.x += this.dx;
    this.y += this.dy;

    if(this.x < x1) this.x += (x2 - x1);
    if(this.x > x2) this.x -= (x2 - x1);
    if(this.y < y1) this.y += (y2 - y1);
    if(this.y > y2) this.y -= (y2 - y1);
  }
};

const Particles1 = compose(
  withProps({
    data: {},
  }),
  withPropsOnChange(['segmentColor'], ({ segmentColor }) => ({
    segmentColorObject: color(segmentColor),
  })),
  withHandlers({
    addPointsInRegion: ({ data, particleDensity }) => ({ x, y, w, h, devicePixelRatio }) => {
      const numberOfPoints = Math.ceil(h * w * particleDensity / Math.pow(devicePixelRatio, 2));

      for(let i = 0; i < numberOfPoints; i += 1) {
        data.points.push(new Particle({
          x: Math.random() * w + x,
          y: Math.random() * h + y,
          dx: Math.random() - 0.5,
          dy: Math.random() - 0.5,
        }));
      }
    },
  }),
  withHandlers({
    setup: ({ data }) => () => {
      data.points = [];
    },
    update: ({ addPointsInRegion, data, particleFill, segmentLength, segmentWidth }) => ({ canvasHeight, canvasWidth, ctx, devicePixelRatio, height, width }, prev = { canvasHeight: 0, canvasWidth: 0 }) => {
      ctx.lineWidth = segmentWidth;
      ctx.fillStyle = particleFill;

      if(canvasHeight < prev.canvasHeight || canvasWidth < prev.canvasWidth) {
        // crop excess points
        data.points = filter(data.points, (point) => {
          if (point.x > canvasWidth + segmentLength) return false;
          if (point.y > canvasHeight + segmentLength) return false;
          return true;
        });
      }

      // bottom edge
      if(canvasHeight > prev.canvasHeight) {
        addPointsInRegion({
          x: 0 - segmentLength,
          y: prev.canvasHeight + segmentLength,
          w: prev.canvasWidth + segmentLength * 2,
          h: canvasHeight - prev.canvasHeight,
          devicePixelRatio,
        });
      }
      // right edge
      if(canvasWidth > prev.canvasWidth) {
        addPointsInRegion({
          x: prev.canvasWidth + segmentLength,
          y: 0 - segmentLength,
          w: canvasWidth - prev.canvasWidth,
          h: prev.canvasHeight + segmentLength * 2,
          devicePixelRatio,
        });
      }
      // bottom right corner
      if(canvasHeight > prev.canvasHeight && canvasWidth > prev.canvasWidth) {
        addPointsInRegion({
          x: prev.canvasWidth + segmentLength,
          y: prev.canvasHeight + segmentLength,
          w: canvasWidth - prev.canvasWidth,
          h: canvasHeight - prev.canvasHeight,
          devicePixelRatio,
        });
      }

      // re-center points
      each(data.points, (point) => {
        point.x += (canvasWidth - prev.canvasWidth) / 2;
        point.y += (canvasHeight - prev.canvasHeight) / 2;
      });
    },
    draw: ({ data, particleSize, particleStrokeColor, particleStrokeWidth, segmentColorObject, segmentLength, segmentWidth }) => ({ ctx, canvasHeight, canvasWidth }) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      let p, q;
      for(let i = 0; i < data.points.length; i += 1) {
        p = data.points[i];
        p.tick({
          x1: 0 - segmentLength,
          y1: 0 - segmentLength,
          x2: canvasWidth + segmentLength,
          y2: canvasHeight + segmentLength,
        });

        for(let j = 0; j < data.points.length; j += 1) {
          q = data.points[j];
          const distanceSquared = Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2);
          if(distanceSquared < (segmentLength * segmentLength)) {
            ctx.beginPath();
            ctx.strokeStyle = segmentColorObject.alpha(1 - distanceSquared / (segmentLength * segmentLength));
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }

      // conserve state changes
      if(particleStrokeWidth) {
        ctx.strokeStyle = particleStrokeColor;
        ctx.lineWidth = particleStrokeWidth;
      }

      for(let i = 0; i < data.points.length; i += 1) {
        p = data.points[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        if(particleStrokeWidth) {
          ctx.stroke();
        }
      }

      // revert for next draw
      if(particleStrokeWidth) {
        ctx.lineWidth = segmentWidth;
      }
    },
  }),
)(AnimatedCanvas);

Particles1.defaultProps = {
  particleDensity: 0.0002,
  particleFill: '#888',
  particleSize: 6,
  particleStrokeColor: 'transparent',
  particleStrokeWidth: 0,
  segmentColor: '#888',
  segmentLength: 140,
  segmentWidth: 1,
};

Particles1.propTypes = {
  particleDensity: PropTypes.number,
  particleFill: PropTypes.string,
  particleSize: PropTypes.number,
  particleStrokeColor: PropTypes.string,
  particleStrokeWidth: PropTypes.number,
  segmentColor: PropTypes.string,
  segmentLength: PropTypes.number,
  segmentWidth: PropTypes.number,

  // inherited from AnimatedCanvas
  className: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
};

export default Particles1;
