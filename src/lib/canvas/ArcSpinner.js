import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';

import AnimatedCanvas from './AnimatedCanvas';

const ArcSpinner = compose(
  withHandlers({
    setup: ({ color, strokeWidth }) => ({ ctx }) => {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
    },
    draw: ({ strokeWidth }) => ({ canvasHeight, canvasWidth, ctx, time }) => {
      const startAngle = (time / 200) % 1000;
      const endAngle = startAngle + Math.PI * (Math.sin(time / 400) + 2) / 2;
      const smallerDimension = Math.min(canvasHeight, canvasWidth);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, canvasHeight / 2, (smallerDimension - strokeWidth) / 2, startAngle, endAngle);
      ctx.stroke();
    },
  }),
)(AnimatedCanvas);

ArcSpinner.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.number,
};

ArcSpinner.defaultProps = {
  color: '#888',
  height: 60,
  maxFps: 70,
  strokeWidth: 10,
  width: 60,
};

export default ArcSpinner;
