import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import times from 'lodash/times';
import styled, {css, keyframes} from 'styled-components';

const fadeDipKeyFrames = (waves = 1, res = 9, trigFunc = 'cos') => keyframes`
  ${times(res + 1, (n) => `${n/res * 100}% {
    opacity: ${Math[trigFunc](n/res * Math.PI * 2 * waves) / 2 + 0.5};
  }`)}
`;
const Letter = styled.span`
  ${({ duration, interval, waves }) => css`
    animation: ${fadeDipKeyFrames(waves)} ${duration}s linear ${interval*duration}s infinite;
  `}
`;

const ShimmerText = ({ children: text, duration, waves }) => (
  <span>
    {map(text, (letter, index) => (
      <Letter key={index} duration={duration} interval={(index/text.length) % 1} waves={waves}>{letter}</Letter>
    ))}
  </span>
);

ShimmerText.propTypes = {
  children: PropTypes.string.isRequired,
  duration: PropTypes.number,
  waves: PropTypes.number,
};
ShimmerText.defaultProps = {
  duration: 1,
  waves: 1,
};

export default ShimmerText;
