import PropTypes from 'prop-types';
import { renderComponent } from 'recompose';
import React from 'react';

const styles = {
  host: { position:'relative' },
  canvas: { width:'100%', height:'100%', position:'absolute' },
};

const CanvasHost = ({ canvasClasses, canvasHeight, canvasStyle, canvasWidth, classes, handleCanvasRef, style }) => (
  <div className={classes} style={{ ...styles.host, ...style }}>
    <canvas
      ref={handleCanvasRef}
      height={canvasHeight}
      width={canvasWidth}
      className={canvasClasses}
      style={{ ...styles.canvas, ...canvasStyle }}
    />
  </div>
);

CanvasHost.propTypes = {
  canvasStyle: PropTypes.object,
  style: PropTypes.object,
};

export const renderCanvasHost = renderComponent(CanvasHost);

export default CanvasHost;
