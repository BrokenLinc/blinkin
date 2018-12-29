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

export default SineWave;
