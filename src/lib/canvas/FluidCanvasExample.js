import { compose } from 'recompose';
import withFluidCanvas from '../util/withFluidCanvas';
import { renderCanvasHost } from './CanvasHost';

const FluidCanvasExample = compose(
  withFluidCanvas({
    callback: (props) => console.log(props.width, props.height, props.ctx),
    throttle: 1000,
  }),
  renderCanvasHost,
)();

export default FluidCanvasExample;
