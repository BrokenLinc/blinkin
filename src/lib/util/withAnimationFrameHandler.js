import { compose, lifecycle, withHandlers } from 'recompose';
import each from 'lodash/each';
import pull from 'lodash/pull';
import throttleHandler from '@hocs/throttle-handler';

const callbacks = [];

const handleNextAnimationFrame = () => {
  window.requestAnimationFrame(handleAnimationFrame);
};

const handleAnimationFrame = () => {
  each(callbacks, (callback) => callback());
  handleNextAnimationFrame();
};

handleNextAnimationFrame();

const withAnimationFrameHandler = (config = {}) => compose(
  withHandlers({
    handleAnimationFrame: (props) => () => {
      config.callback && config.callback(props);
    },
  }),
  throttleHandler('handleAnimationFrame', config.throttle || 42),
  lifecycle({
    componentDidMount() {
      callbacks.push(this.props.handleAnimationFrame);
    },
    componentWillUnmount() {
      pull(callbacks, this.props.handleAnimationFrame);
    },
  }),
);

export default withAnimationFrameHandler;
