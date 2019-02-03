class Particle {
  constructor({ x = 0, y = 0, dx = 0, dy = 0 }) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
  tick({ x1, y1, x2, y2 }) {
    this.x += this.dx;
    this.y += this.dy;

    if(this.x < x1) this.x += (x2 - x1);
    if(this.x > x2) this.x -= (x2 - x1);
    if(this.y < y1) this.y += (y2 - y1);
    if(this.y > y2) this.y -= (y2 - y1);
  }
}

export default Particle;
