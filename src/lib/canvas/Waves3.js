import { compose, withHandlers, withPropsOnChange } from 'recompose';
import PropTypes from 'prop-types';

import SineWave from '../util/SineWave';
import AnimatedCanvas from './AnimatedCanvas';

const Waves3 = compose(
  withPropsOnChange([], () => ({
    waves: [
      new SineWave({
        frequency: 1 / 80,
        amplitudeMultiplier: 1 / 20,
        timeFactor: -1200,
        color: (envelope) => `rgba(0, 52, 99, ${(envelope ** 3)})`,
      }),
      new SineWave({
        frequency: 1 / 60,
        amplitudeMultiplier: 1 / 35,
        timeFactor: -600,
        color: (envelope) => `rgba(0, 112, 147, ${(envelope ** 3)})`,
      }),
      new SineWave({
        frequency: 1 / 50,
        amplitudeMultiplier: 1 / 50,
        timeFactor: -300,
        color: (envelope) => `rgba(0, 167, 191, ${(envelope ** 3)})`,
      }),
    ]
  })),
  withHandlers({
    setup: () => ({ ctx, devicePixelRatio }) => {
      ctx.lineWidth = devicePixelRatio;
    },
    draw: ({ waves }) => ({ ctx, canvasHeight: height, canvasWidth: width, centerY }) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < waves.length; i += 1) {
        waves[i].reset();
        waves[i].tick();
      }

      const envelopeMultiplier = Math.PI / width;
      const segmentWidth = width / 128;

      for (let x = 0; x <= width; x += segmentWidth) {
        // envelope tapers the ends
        const envelope = Math.sin(x * envelopeMultiplier);

        for (let i = 0; i < waves.length; i += 1) {
          const wave = waves[i];
          wave.incrementSegment(segmentWidth);

          // adjust y for the canvas coordinates
          const y1 = height * (wave.y1 * envelope) + centerY + i * 5;
          const y2 = height * (wave.y2 * envelope) + centerY + i * 5;

          // Skip the first point as "lineTo" value
          if (x !== 0) {
            ctx.beginPath();
            ctx.moveTo(wave.x1, y1);
            ctx.strokeStyle = wave.color(envelope);
            ctx.lineTo(wave.x2, y2);
            ctx.stroke();
          }
        }
      }
    },
  }),
)(AnimatedCanvas);

Waves3.propTypes = {
  className: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  height: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.number,
};

Waves3.defaultProps = {
  height: 320,
  width: 320,
};

export default Waves3;
