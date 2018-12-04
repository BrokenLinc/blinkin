import React, { Component } from 'react';
import PropTypes from 'prop-types';

const MAX_FPS = 50;
const SEGMENT_LENGTH = 5;
const WIDTH = 320;
const HEIGHT = 320;
const TRANSITION_DURATION = 600;

const style = {
  canvas: {
    width: WIDTH,
    height: HEIGHT,
  },
};

class SineWave {
  constructor({ frequency, amplitudeMultiplier, timeFactor, color }) {
    this.frequency = frequency;
    this.amplitudeMultiplier = amplitudeMultiplier;
    this.timeFactor = timeFactor;
    this.color = color;

    this.reset();
    this.tick();
  }

  reset() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
  }

  tick() {
    this.timeShift = new Date().getTime() / this.timeFactor;
  }

  incrementSegment(length) {
    this.x1 = this.x2;
    this.y1 = this.y2;
    this.x2 += length;
    this.y2 = Math.sin(this.x2 * this.frequency + this.timeShift) * this.amplitudeMultiplier;
  }
}

const getWindowDimensions = () => {
  const width = WIDTH * window.devicePixelRatio;
  const height = HEIGHT * window.devicePixelRatio;
  const midLine = height / 2;
  const envelopeMultiplier = Math.PI / width;

  return {
    width,
    height,
    midLine,
    envelopeMultiplier,
  };
};

class Waves extends Component {
  constructor(props) {
    super(props);

    this.state = getWindowDimensions();
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = window.devicePixelRatio;

    this.waves = [
      new SineWave({
        frequency: 1 / 80,
        amplitudeMultiplier: this.state.width / 20,
        timeFactor: -1200,
        color: (envelope) => `rgba(0, 52, 99, ${(envelope ** 3)})`,
      }),
      new SineWave({
        frequency: 1 / 60,
        amplitudeMultiplier: this.state.width / 35,
        timeFactor: -600,
        color: (envelope) => `rgba(0, 112, 147, ${(envelope ** 3)})`,
      }),
      new SineWave({
        frequency: 1 / 50,
        amplitudeMultiplier: this.state.width / 50,
        timeFactor: -300,
        color: (envelope) => `rgba(0, 167, 191, ${(envelope ** 3)})`,
      }),
    ];

    this.gameLoop();
  }

  gameLoop() {
    if (this.willUnmount) return;

    const now = new Date().getTime();

    if (this.props.isActive) {
      this.expirationTime = now + TRANSITION_DURATION;
    }

    if (this.expirationTime >= now) {
      this.draw();
    }

    requestAnimationFrame(() => {
      setTimeout(this.gameLoop.bind(this), 1000 / MAX_FPS); // throttle fps
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);

    for (let i = 0; i < this.waves.length; i += 1) {
      this.waves[i].reset();
      this.waves[i].tick();
    }
    for (let x = 0; x <= this.state.width; x += SEGMENT_LENGTH) {
      // envelope tapers the ends
      const envelope = Math.sin(x * this.state.envelopeMultiplier);

      for (let i = 0; i < this.waves.length; i += 1) {
        const wave = this.waves[i];
        wave.incrementSegment(SEGMENT_LENGTH);

        // adjust y for the canvas coordinates
        const y1 = wave.y1 * envelope + this.state.midLine + i * 5;
        const y2 = wave.y2 * envelope + this.state.midLine + i * 5;

        // Skip the first point as "lineTo" value
        if (x !== 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(wave.x1, y1);
          this.ctx.strokeStyle = wave.color(envelope);
          this.ctx.lineTo(wave.x2, y2);
          this.ctx.stroke();
        }
      }
    }
  }

  render() {
    return (
      <canvas
        style={style.canvas}
        width={this.state.width}
        height={this.state.height}
        ref={(element) => {
          this.canvas = element;
        }}
      />
    );
  }
}

Waves.propTypes = { isActive: PropTypes.bool };

export default Waves;
