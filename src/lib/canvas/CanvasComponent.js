import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

// TODO: add resize detector

const getWindowDimensions = (props) => {
  const width = props.width * window.devicePixelRatio;
  const height = props.height * window.devicePixelRatio;

  return {
    hostWidth: props.width,
    hostHeight: props.height,
    width,
    height,
  };
};

class CanvasComponent extends Component {
  constructor(props) {
    super(props);

    // this.state = getWindowDimensions(props);
    this.state = {};
  }

  handleCanvasRef = (element) => {
    if (element) {
      this.canvas = element;
      this.ctx = this.canvas.getContext('2d');
    }
  }

  handleResize = (width, height) => {
    // console.log(width, height);
    this.setState(getWindowDimensions({ width, height }));
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  componentDidMount() {
    this.setup && this.setup({
      canvas: this.canvas,
      ctx: this.ctx,
      ...this.state,
    });

    this.gameLoop();
  }

  gameLoop() {
    if (this.willUnmount) return;

    const now = new Date().getTime();

    if (!this.props.disabled) {
      this.expirationTime = now + (this.props.disablingDelay || 0);
    }

    if (this.expirationTime >= now && this.ctx) {
      this.draw && this.draw({
        canvas: this.canvas,
        ctx: this.ctx,
        ...this.state,
      });
    }

    requestAnimationFrame(() => {
      setTimeout(this.gameLoop.bind(this), 1000 / (this.props.maxFps || 50)); // throttle fps
    });
  }

  render() {
    return (
      <Fragment>
        <ReactResizeDetector handleWidth handleHeight onResize={this.handleResize} />
        <canvas
          style={{ width: this.state.hostWidth, height: this.state.hostHeight}}
          width={this.state.width}
          height={this.state.height}
          ref={this.handleCanvasRef}
        />
      </Fragment>
    );
  }
}

CanvasComponent.propTypes = {
  disabled: PropTypes.bool,
};

export default CanvasComponent;
