import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withProps } from 'recompose';

import { LINE_CAPS } from '../constants/lineCap';
import AnimatedCanvas from './AnimatedCanvas';

const ArcSpinner = compose(
  withProps({
    data: {},
  }),
  withHandlers({
    update: ({ color, data, lineCap, strokeWidth }) => ({ canvasHeight, canvasWidth, ctx }) => {
      if (typeof color === 'object') {
        const gradient = ctx.createLinearGradient(...color.coords);
        for (let i = 0; i < color.colorStops.length; i += 1) {
          gradient.addColorStop(color.colorStops[i].stop, color.colorStops[i].color);
        }
        ctx.strokeStyle = gradient;
      } else {
        ctx.strokeStyle = color;
      }

      ctx.lineCap = lineCap;
      ctx.lineWidth = strokeWidth;

      data.radius = (Math.min(canvasHeight, canvasWidth) - strokeWidth) / 2;
    },
    draw: ({ angleSpread, data, endSpeed, startSpeed }) => ({ canvasHeight, canvasWidth, ctx, time }) => {
      const startAngle = (time * (startSpeed / 1000)) % 1000;
      const endAngle = startAngle + Math.PI * ((Math.sin(time * endSpeed / 1000) + 1) * angleSpread + (1 - angleSpread));
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, canvasHeight / 2, data.radius, startAngle, endAngle);
      ctx.stroke();
    },
  }),
)(AnimatedCanvas);

ArcSpinner.propTypes = {
  angleSpread: PropTypes.number,
  color: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  endSpeed: PropTypes.number,
  lineCap: PropTypes.oneOf(LINE_CAPS),
  startSpeed: PropTypes.number,
  strokeWidth: PropTypes.number,

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

ArcSpinner.defaultProps = {
  angleSpread: 0.9,
  color: '#888',
  endSpeed: 2.2,
  height: 60,
  lineCap: 'butt',
  maxFps: 70,
  startSpeed: 8.8,
  strokeWidth: 6,
  width: 60,
};

ArcSpinner.demoProps = {
  color: 'red',
  height: 100,
  lineCap: 'round',
  strokeWidth: 16,
  width: 100,
};

ArcSpinner.knobConfig = {
  width: { group: 'Size' },
  height: { group: 'Size' },
  color: {
    group: 'Style',
    type: 'color',
  },
  strokeWidth: { group: 'Style' },
  lineCap: {
    group: 'Style',
    type: 'radios',
    options: LINE_CAPS,
  },
  angleSpread: { group: 'Timing' },
  startSpeed: { group: 'Timing' },
  endSpeed: { group: 'Timing' },
};

export default ArcSpinner;
