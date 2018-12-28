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
    height,
    width,
  };
};

class CanvasComponent extends Component {
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

  getPassableProps() {
    return {
      canvas: this.canvas,
      ctx: this.ctx,
      ...this.props,
      ...this.state,
    };
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  componentDidMount() {
    this.setup && this.setup(this.getPassableProps());
    this.gameLoop();
  }

  componentWillReceiveProps(nextProps) {
    // TODO: skip if props haven't changed
    this.setState(getState(nextProps));
  }

  gameLoop() {
    if (this.willUnmount) return;

    const { disabled, disablingDelay, maxFps } = this.props;
    const now = new Date().getTime();

    if (!disabled) {
      this.expirationTime = now + disablingDelay;
    }

    if (this.expirationTime >= now && this.ctx) {
      this.draw && this.draw(this.getPassableProps());
    }

    requestAnimationFrame(() => {
      setTimeout(this.gameLoop.bind(this), 1000 / maxFps); // throttle fps
    });
  }

  render() {
    const { canvasHeight,  canvasWidth,  height,  width } = this.state;

    return (
      <canvas
        style={{ height, width }}
        height={canvasHeight}
        width={canvasWidth}
        ref={this.handleCanvasRef}
      />
    );
  }
}

CanvasComponent.propTypes = {
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  height: PropTypes.number,
  maxFps: PropTypes.number,
  width: PropTypes.number,
};

CanvasComponent.defaultProps = {
  devicePixelRatio: window.devicePixelRatio,
  disablingDelay: 0,
  height: 320,
  maxFps: 50,
  width: 320,
};

export default CanvasComponent;
