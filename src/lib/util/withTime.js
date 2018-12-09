import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { withSafeAnimationFrame } from '@hocs/safe-timers';
import throttleHandlers from '@hocs/throttle-handler';

const withTime = compose(
  withSafeAnimationFrame,
  withState('time', 'setTime', new Date().getTime()),
  withHandlers({
    handleAnimationFrame: ({ setTime }) => () => {
      setTime(new Date().getTime());
    },
  }),
  throttleHandlers('handleAnimationFrame', 20),
  lifecycle({
    componentDidMount() {
      this.props.requestSafeAnimationFrame(this.props.handleAnimationFrame);
    },
    componentDidUpdate() {
      this.props.requestSafeAnimationFrame(this.props.handleAnimationFrame);
    },
  }),
);

export default withTime;
