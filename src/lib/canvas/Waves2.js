import CanvasComponent from './CanvasComponent';

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

class Waves2 extends CanvasComponent {

  setup({ ctx, devicePixelRatio }) {
    ctx.lineWidth = devicePixelRatio;

    this.waves = [
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
    ];
  }
  draw({ ctx, canvasHeight: height, canvasWidth: width }) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this.waves.length; i += 1) {
      this.waves[i].reset();
      this.waves[i].tick();
    }

    const envelopeMultiplier = Math.PI / width;
    const midLine = height / 2;
    const segmentWidth = width / 128;

    for (let x = 0; x <= width; x += segmentWidth) {
      // envelope tapers the ends
      const envelope = Math.sin(x * envelopeMultiplier);

      for (let i = 0; i < this.waves.length; i += 1) {
        const wave = this.waves[i];
        wave.incrementSegment(segmentWidth);

        // adjust y for the canvas coordinates
        const y1 = height * (wave.y1 * envelope) + midLine + i * 5;
        const y2 = height * (wave.y2 * envelope) + midLine + i * 5;

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
  }
}

export default Waves2;
