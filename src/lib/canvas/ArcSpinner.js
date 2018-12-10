import PropTypes from 'prop-types';
import { compose } from 'recompose';
import withFluidCanvas from '../util/withFluidCanvas';
import { renderCanvasHost } from './CanvasHost';

const ArcSpinner = compose(
  withFluidCanvas({
    callback: ({ canvasHeight, canvasWidth, color, ctx, strokeWidth }, time) => {
      const startAngle = (time / 200) % 1000;
      const endAngle = startAngle + Math.PI * (Math.sin(time / 400) + 2) / 2;
      const smallerDimension = Math.min(canvasHeight, canvasWidth);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, canvasHeight / 2, (smallerDimension - strokeWidth) / 2, startAngle, endAngle);
      ctx.stroke();
    },
    throttle: 21,
  }),
  renderCanvasHost,
)();

ArcSpinner.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.number,
};

ArcSpinner.defaultProps = {
  color: 'magenta',
  strokeWidth: 10,
};

export default ArcSpinner;
