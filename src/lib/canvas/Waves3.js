import { compose, withHandlers, withPropsOnChange } from 'recompose';
import PropTypes from 'prop-types';
import Color from 'color';

import SineWave from '../util/SineWave';
import AnimatedCanvas from './AnimatedCanvas';

const Waves3 = compose(
  withPropsOnChange(['color'], ({ color }) => ({
    color: Color(color),
  })),
  withPropsOnChange(
    ['amplitudeMultiplier', 'frequency', 'timeFactor'],
    ({ amplitudeMultiplier, frequency, timeFactor }) => ({
    wave: new SineWave({
      frequency,
      amplitudeMultiplier,
      timeFactor,
    }),
  })),
  withHandlers({
    draw: ({ wave }) => ({ ctx, canvasHeight: height, canvasWidth: width, centerY, color, devicePixelRatio, lineWidth }) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = devicePixelRatio * lineWidth;

      wave.reset();
      wave.tick();

      const envelopeMultiplier = Math.PI / width;
      const segmentWidth = width / 128;

      for (let x = 0; x <= width; x += segmentWidth) {
        // envelope tapers the ends
        const envelope1 = Math.sin(x * envelopeMultiplier);
        const envelope2 = Math.sin((x + segmentWidth) * envelopeMultiplier);

        wave.incrementSegment(segmentWidth);

        // adjust y for the canvas coordinates
        const y1 = height * (wave.y1 * envelope1) + centerY;
        const y2 = height * (wave.y2 * envelope2) + centerY;

        // Skip the first point as "lineTo" value
        if (x !== 0) {
          ctx.beginPath();
          ctx.moveTo(wave.x1, y1);
          ctx.strokeStyle = color.fade(1 - envelope1 ** 1.3).hsl().string();
          ctx.lineTo(wave.x2, y2);
          ctx.stroke();
        }
      }
    },
  }),
)(AnimatedCanvas);

Waves3.propTypes = {
  amplitudeMultiplier: PropTypes.number,
  className: PropTypes.string,
  color: PropTypes.string,
  devicePixelRatio: PropTypes.number,
  disabled: PropTypes.bool,
  disablingDelay: PropTypes.number,
  frequency: PropTypes.number,
  height: PropTypes.number,
  lineWidth: PropTypes.number,
  maxFps: PropTypes.number,
  style: PropTypes.object,
  timeFactor: PropTypes.number,
  width: PropTypes.number,
};

Waves3.defaultProps = {
  amplitudeMultiplier: 1 / 10,
  color: 'black',
  frequency: 1 / 80,
  height: 320,
  lineWidth: 1,
  maxFps: 60,
  timeFactor: -1200,
  width: 320,
};

Waves3.getRandomProps = () => ({
  amplitudeMultiplier: 1 / (Math.random() * 14 + 4),
  color: "#" + Math.random().toString(16).slice(2, 8),
  frequency: 1 / (Math.random() * 100),
  lineWidth: Math.random() * 1 + 1,
  timeFactor: (Math.random() - 0.5) * 2500,
});

Waves3.demoProps = {
  amplitudeMultiplier: 1 / 8,
  color: 'magenta',
  frequency: 1 / 40,
  lineWidth: 2,
  timeFactor: -240,
};

Waves3.knobConfig = {
  amplitudeMultiplier: {},
  color: { type: 'color' },
  frequency: {},
  lineWidth: {},
  timeFactor: {},
};

export default Waves3;
