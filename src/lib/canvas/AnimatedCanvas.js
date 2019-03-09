import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

const getState = ({ devicePixelRatio, height, width }) => {
  const canvasHeight = height * devicePixelRatio;
  const canvasWidth = width * devicePixelRatio;

  return {
    canvasHeight,
    canvasWidth,
    centerX: canvasWidth / 2, // TODO: round for performance gain?
    centerY: canvasHeight / 2, // TODO: round for performance gain?
  };
};

class AnimatedCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = getState(props);
    this.data = {};
  }

  handleCanvasRef = (element, layer) => {
    if (element) {
      const contextName = layer ? `${layer}_ctx` : 'ctx';
      const canvasName = layer ? `${layer}_canvas` : 'canvas';
      this.data[canvasName] = element;
      this.data[contextName] = element.getContext('2d');
    }
  };

  getPassableProps(nextProps, nextState) {
    return {
      ...(nextProps || this.props),
      ...(nextState || this.state),
      ...this.data,
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

    if (this.expirationTime >= now) {
      this.props.draw(this.getPassableProps());
    }

    if(!once) {
      requestAnimationFrame(() => {
        setTimeout(this.gameLoop.bind(this), 1000 / maxFps); // throttle fps
      });
    }
  }

  render() {
    const { className, devicePixelRatio, height, layers = '', style, width } = this.props;
    const { canvasHeight, canvasWidth } = this.state;

    // TODO: consider moving into withPropsOnChange
    const layerNames = layers.replace(/ /g, '').split(',');

    // TODO: move inline styles into constant objects, or use Emotion, etc.
    return (
      <div className={className} style={{ height, overflow: 'hidden', position: 'relative', width, ...style }}>
        {map(layerNames, (layerName) => (
          <canvas
            style={{
              left: 0,
              position: 'absolute',
              top: 0,
              transform: `scale(${1/devicePixelRatio})`,
              transformOrigin: '0 0',
            }}
            height={canvasHeight}
            width={canvasWidth}
            ref={(element) => this.handleCanvasRef(element, layerName)}
          />
        ))}
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
  layers: PropTypes.string, // TODO: accept arrays, disallow duplicates
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
