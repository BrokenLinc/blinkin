import React from 'react';
import PropTypes from 'prop-types';

import describeArc from '../util/describeArc';
import SVG_ATTRIBUTES from '../const/svgAttributes';

const Ring  = ({ angle, basis, color, size, strokeWidth }) => (
  <svg
    {...SVG_ATTRIBUTES}
    viewBox={[0, 0, basis, basis].join(' ')}
    width={size}
    height={size}
  >
    <path d={describeArc(basis/2, basis/2, (basis - strokeWidth)/2, 0, angle)} stroke={color} strokeWidth={strokeWidth} fill="none" />
  </svg>
);
Ring.propTypes = {
  angle: PropTypes.number,
  basis: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};
Ring.defaultProps = {
  angle: 270,
  basis: 100,
  color: '#000',
  size: 100,
  strokeWidth: 4,
};

export default Ring;
