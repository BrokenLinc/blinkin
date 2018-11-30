import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components'

import describeArc from '../util/describeArc';
import SVG_ATTRIBUTES from '../const/svgAttributes';

const spinnerKeyframes = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.svg`
  animation: ${spinnerKeyframes} ${({ duration }) => duration}s linear 0s infinite;
`;

const Ring  = ({ angle, basis, color, duration, size, strokeWidth }) => (
  <Spinner
    {...SVG_ATTRIBUTES}
    duration={duration}
    viewBox={[0, 0, basis, basis].join(' ')}
    width={size}
    height={size}
  >
    <path d={describeArc(basis/2, basis/2, (basis - strokeWidth)/2, 0, angle)} stroke={color} strokeWidth={strokeWidth} fill="none" />
  </Spinner>
);
Ring.propTypes = {
  angle: PropTypes.number,
  basis: PropTypes.number,
  color: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number,
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
