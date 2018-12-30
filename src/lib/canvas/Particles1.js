import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import PropTypes from 'prop-types';
import { withResizeDetector } from 'react-resize-detector';
import { each, filter } from 'lodash';

import AnimatedCanvas from './AnimatedCanvas';

const POINT_PROXIMITY = 140;
const POINT_PROXIMITY_SQUARED = POINT_PROXIMITY * POINT_PROXIMITY;
const POINTS_PER_SQUARE_PIXEL = 0.0002;

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
    data: { points: [] },
  }),
  withHandlers({
    addPointsInRegion: ({ data }) => ({ x, y, w, h, devicePixelRatio }) => {
      const numberOfPoints = Math.ceil(h * w * POINTS_PER_SQUARE_PIXEL / Math.pow(devicePixelRatio, 2));

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
    update: ({ addPointsInRegion, data }) => ({ canvasHeight, canvasWidth, ctx, devicePixelRatio, height, width }, prev = { canvasHeight: 0, canvasWidth: 0 }) => {
      ctx.lineWidth = 1;
      ctx.fillStyle = '#888';

      if(canvasHeight < prev.canvasHeight || canvasWidth < prev.canvasWidth) {
        // crop excess points
        data.points = filter(data.points, (point) => {
          if (point.x > canvasWidth + POINT_PROXIMITY) return false;
          if (point.y > canvasHeight + POINT_PROXIMITY) return false;
          return true;
        });
      }

      // bottom edge
      if(canvasHeight > prev.canvasHeight) {
        addPointsInRegion({
          x: 0 - POINT_PROXIMITY,
          y: prev.canvasHeight + POINT_PROXIMITY,
          w: prev.canvasWidth + POINT_PROXIMITY * 2,
          h: canvasHeight - prev.canvasHeight,
          devicePixelRatio,
        });
      }
      // right edge
      if(canvasWidth > prev.canvasWidth) {
        addPointsInRegion({
          x: prev.canvasWidth + POINT_PROXIMITY,
          y: 0 - POINT_PROXIMITY,
          w: canvasWidth - prev.canvasWidth,
          h: prev.canvasHeight + POINT_PROXIMITY * 2,
          devicePixelRatio,
        });
      }
      // bottom right corner
      if(canvasHeight > prev.canvasHeight && canvasWidth > prev.canvasWidth) {
        addPointsInRegion({
          x: prev.canvasWidth + POINT_PROXIMITY,
          y: prev.canvasHeight + POINT_PROXIMITY,
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
    draw: ({ data }) => ({ ctx, canvasHeight, canvasWidth }) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      let p, q;
      for(let i = 0; i < data.points.length; i += 1) {
        p = data.points[i];
        p.tick({
          x1: 0 - POINT_PROXIMITY,
          y1: 0 - POINT_PROXIMITY,
          x2: canvasWidth + POINT_PROXIMITY,
          y2: canvasHeight + POINT_PROXIMITY,
        });
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        for(let j = 0; j < data.points.length; j += 1) {
          q = data.points[j];
          const distanceSquared = Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2);
          if(distanceSquared < POINT_PROXIMITY_SQUARED) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(127, 127, 127, ${1 - distanceSquared / POINT_PROXIMITY_SQUARED})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    },
  }),
  withResizeDetector,
)(AnimatedCanvas);

Particles1.propTypes = {
  className: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
};

export default Particles1;
