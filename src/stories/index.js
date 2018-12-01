import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import { color, number, select, withKnobs } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';
import { withBackgrounds } from '@storybook/addon-backgrounds';

import Ring from '../lib/svg/Ring';
import ShimmerText from '../lib/text/ShimmerText';

setAddon(JSXAddon);

const withThemeBackgrounds = withBackgrounds([
  { name: 'white', value: '#fff', default: true },
  { name: 'twitter', value: '#00aced' },
  { name: 'facebook', value: '#3b5998' },
]);

storiesOf('Ring', module)
  .addDecorator(withThemeBackgrounds)
  .addDecorator(withKnobs)
  .addWithJSX('Default', () => <Ring />)
  .addWithJSX('Color', () => <Ring color="#6523e2" />)
  .addWithJSX('Stroke', () => <Ring strokeWidth={24} strokeLinecap="round" />)
  .addWithJSX('Angle', () => <Ring angle={120} />)
  .addWithJSX('Size', () => <Ring size={40} />)
  .addWithJSX('Timing', () => <Ring duration={4} />)
  .addWithJSX('Knobs', () => <Ring
    angle={number('angle', Ring.defaultProps.angle)}
    basis={number('basis', Ring.defaultProps.basis)}
    color={color('color', Ring.defaultProps.color)}
    duration={number('duration', Ring.defaultProps.duration)}
    size={number('size', Ring.defaultProps.size)}
    strokeLinecap={select('strokeLinecap', ['butt', 'round', 'square'])}
    strokeWidth={number('strokeWidth', Ring.defaultProps.strokeWidth)}
  />)
;

storiesOf('ShimmerText', module)
  .addWithJSX('Default', () => <ShimmerText>Hello beautiful world gone awry</ShimmerText>)
  .addWithJSX('Duration', () => <ShimmerText duration={5}>Hello beautiful world gone awry</ShimmerText>);
