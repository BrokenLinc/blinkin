import times from 'lodash/times';
import assign from 'lodash/assign';
import filter from 'lodash/filter';
import each from 'lodash/each';

import Particle from './Particle';

const addPointsInRegion = ({ points, particleDensity, x, y, w, h, devicePixelRatio }) => {
  const numberOfPoints = Math.ceil(h * w * particleDensity / Math.pow(devicePixelRatio, 2));

  times(numberOfPoints, () => {
    points.push(new Particle({
      x: Math.random() * w + x,
      y: Math.random() * h + y,
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5,
    }));
  })
}

class PointSystem {
  constructor(props) {
    assign(this, {
      points: [],
      ...props,
    });
  }
  addPointsInRegion(props) {
    addPointsInRegion({
      ...this,
      ...props,
    });
  }
  setSize(props) {
    this.devicePixelRatio = devicePixelRatio;

    if(props.canvasHeight < this.canvasHeight || props.canvasWidth < this.canvasWidth) {
      // crop excess points
      this.points = filter(this.points, (point) => {
        if (point.x > props.canvasWidth + this.edgeThreshold) return false;
        if (point.y > props.canvasHeight + this.edgeThreshold) return false;
        return true;
      });
    }

    // bottom edge
    if(props.canvasHeight > this.canvasHeight) {
      this.addPointsInRegion({
        x: 0 - this.edgeThreshold,
        y: this.canvasHeight + this.edgeThreshold,
        w: this.canvasWidth + this.edgeThreshold * 2,
        h: props.canvasHeight - this.canvasHeight,
      });
    }
    // right edge
    if(props.canvasWidth > this.canvasWidth) {
      this.addPointsInRegion({
        x: this.canvasWidth + this.edgeThreshold,
        y: 0 - this.edgeThreshold,
        w: props.canvasWidth - this.canvasWidth,
        h: this.canvasHeight + this.edgeThreshold * 2,
      });
    }
    // bottom right corner
    if(props.canvasHeight > this.canvasHeight && props.canvasWidth > this.canvasWidth) {
      this.addPointsInRegion({
        x: this.canvasWidth + this.edgeThreshold,
        y: this.canvasHeight + this.edgeThreshold,
        w: props.canvasWidth - this.canvasWidth,
        h: props.canvasHeight - this.canvasHeight,
      });
    }

    // re-center points
    each(this.points, (point) => {
      point.x += (props.canvasWidth - this.canvasWidth) / 2;
      point.y += (props.canvasHeight - this.canvasHeight) / 2;
    });

    assign(this, props);
  }
  tick() {
    each(this.points, (p) => {
      p.tick({
        x1: 0 - this.edgeThreshold,
        y1: 0 - this.edgeThreshold,
        x2: this.canvasWidth + this.edgeThreshold,
        y2: this.canvasHeight + this.edgeThreshold,
      });
    });
  }
}

export default PointSystem;
