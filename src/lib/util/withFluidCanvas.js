import { compose, withPropsOnChange } from 'recompose';
import { withResizeDetector } from 'react-resize-detector';
import withAnimationFrameHandler from './withAnimationFrameHandler';
import withCanvasContext from './withCanvasContext';

const withFluidCanvas = (config) => compose(
  withResizeDetector,
  withPropsOnChange(['height'], ({ height }) => ({
    canvasHeight: (height || 0) * devicePixelRatio,
  })),
  withPropsOnChange(['width'], ({ width }) => ({
    canvasWidth: (width || 0) * devicePixelRatio,
  })),
  withCanvasContext,
  withAnimationFrameHandler(config),
);

export default withFluidCanvas;
