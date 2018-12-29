import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';

import AnimatedCanvas from './AnimatedCanvas';

const START_SPEED = 8.8;
const END_SPEED = 2.2;
const ANGLE_SPREAD = 0.9;

const ArcSpinner = compose(
  withHandlers({
    setup: ({ color, lineCap, strokeWidth }) => ({ ctx }) => {
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
    },
    draw: ({ strokeWidth }) => ({ canvasHeight, canvasWidth, ctx, time }) => {
      const startAngle = (time * (START_SPEED / 1000)) % 1000;
      const endAngle = startAngle + Math.PI * ((Math.sin(time * END_SPEED / 1000) + 1) * ANGLE_SPREAD + (1 - ANGLE_SPREAD));
      const smallerDimension = Math.min(canvasHeight, canvasWidth);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, canvasHeight / 2, (smallerDimension - strokeWidth) / 2, startAngle, endAngle);
      ctx.stroke();
    },
  }),
)(AnimatedCanvas);

ArcSpinner.propTypes = {
  color: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  lineCap: PropTypes.string,
  strokeWidth: PropTypes.number,
};

ArcSpinner.defaultProps = {
  color: '#000',
  // color: {
  //   coords: [0, 0, 0, 120],
  //   colorStops: [
  //     { stop: 0, color: '#22BBEE' },
  //     { stop: 1, color: '#2222CC' },
  //   ],
  // },
  height: 60,
  lineCap: 'round',
  maxFps: 70,
  strokeWidth: 6,
  width: 60,
};

export default ArcSpinner;
