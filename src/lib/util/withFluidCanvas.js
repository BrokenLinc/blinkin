import { compose } from 'recompose';
import { withResizeDetector } from 'react-resize-detector';
import withAnimationFrameHandler from './withAnimationFrameHandler';
import withCanvasContext from './withCanvasContext';

const withFluidCanvas = (config) => compose(
  withResizeDetector,
  withCanvasContext,
  withAnimationFrameHandler(config),
);

export default withFluidCanvas;
