import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';

import SVG_ATTRIBUTES from '../const/svgAttributes';
import describeArc from '../util/describeArc';

const clockwiseKeyframes = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;
const SpinningPath = styled.path`
  ${({ duration, origin }) => css`
    animation: ${clockwiseKeyframes} ${duration}s linear 0s infinite;
    transform-origin: ${origin[0]}px ${origin[1]}px;
  `}
`;

const Ring  = ({ angle, basis, color, duration, size, strokeLinecap, strokeWidth }) => (
  <svg
    {...SVG_ATTRIBUTES}
    viewBox={[0, 0, basis, basis].join(' ')}
    width={size}
    height={size}
  >
    <SpinningPath
      d={describeArc(basis/2, basis/2, (basis - strokeWidth)/2, 0, angle)}
      duration={duration}
      fill="none"
      origin={[basis/2, basis/2]}
      stroke={color}
      strokeLinecap={strokeLinecap}
      strokeWidth={strokeWidth}
    />
  </svg>
);
Ring.propTypes = {
  angle: PropTypes.number,
  basis: PropTypes.number,
  color: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeWidth: PropTypes.number,
};
Ring.defaultProps = {
  angle: 270,
  basis: 100,
  color: '#888',
  duration: 1,
  size: 100,
  strokeWidth: 4,
};

export default Ring;
