import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getState = ({ devicePixelRatio, height, width }) => {
  const canvasHeight = height * devicePixelRatio;
  const canvasWidth = width * devicePixelRatio;

  return {
    canvasHeight,
    canvasWidth,
    centerX: canvasWidth / 2, // TODO: round?
    centerY: canvasHeight / 2, // TODO: round?
  };
};

class AnimatedCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = getState(props);
  }

  handleCanvasRef = (element) => {
    if (element) {
      this.canvas = element;
      this.ctx = this.canvas.getContext('2d');
    }
  };

  getPassableProps(nextProps, nextState) {
    return {
      ...(nextProps || this.props),
      ...(nextState || this.state),
      canvas: this.canvas,
      ctx: this.ctx,
      time: new Date().getTime(),
    };
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  componentDidMount() {
    this.props.setup(this.getPassableProps());
    this.props.update(this.getPassableProps());
    this.gameLoop();
  }

  componentWillReceiveProps(nextProps) {
    // TODO: lodash shallow equal?
    let propsAreIdentical = true;
    if (nextProps.devicePixelRatio !== this.props.devicePixelRatio) propsAreIdentical = false;
    if (nextProps.height !== this.props.height) propsAreIdentical = false;
    if (nextProps.width !== this.props.width) propsAreIdentical = false;

    if (!propsAreIdentical) {
      this.setState(getState(nextProps));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.update(
      this.getPassableProps(),
      this.getPassableProps(prevProps, prevState),
    );
    this.gameLoop(true);
  }

  gameLoop(once) {
    if (this.willUnmount) return;

    const { disabled, disablingDelay, maxFps } = this.props;
    const now = new Date().getTime();

    if (!disabled) {
      this.expirationTime = now + disablingDelay;
    }

    if (this.expirationTime >= now && this.ctx) {
      this.props.draw(this.getPassableProps());
    }

    if(!once) {
      requestAnimationFrame(() => {
        setTimeout(this.gameLoop.bind(this), 1000 / maxFps); // throttle fps
      });
    }
  }

  render() {
    const { className, devicePixelRatio, height, style, width } = this.props;
    const { canvasHeight, canvasWidth } = this.state;

    return (
      <div className={className} style={{ height, overflow: 'hidden', width, ...style }}>
        <canvas
          style={{
            transform: `scale(${1/devicePixelRatio})`,
            transformOrigin: '0 0',
          }}
          height={canvasHeight}
          width={canvasWidth}
          ref={this.handleCanvasRef}
        />
      </div>
    );
  }
}

AnimatedCanvas.propTypes = {
  draw: PropTypes.func,
  setup: PropTypes.func,
  update: PropTypes.func,

  // could be inherited by wrapped components
  className: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  height: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.number,
};

AnimatedCanvas.defaultProps = {
  devicePixelRatio: window.devicePixelRatio,
  disablingDelay: 0,
  draw: () => {},
  height: 0,
  maxFps: 70,
  setup: () => {},
  update: () => {},
  width: 0,
};

export default AnimatedCanvas;
