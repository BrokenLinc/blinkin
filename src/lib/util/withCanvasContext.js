import { compose, withHandlers, withState } from 'recompose';

const withCanvasContext = compose(
  withState('canvas', 'setCanvas'),
  withState('ctx', 'setContext'),
  withHandlers({
    handleCanvasRef: ({ setCanvas, setContext }) => (element) => {
      setCanvas(element);
      setContext(element && element.getContext('2d'));
    },
  }),
);

export default withCanvasContext;
