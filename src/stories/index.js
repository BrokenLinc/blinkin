import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import { color, number, select, text, withKnobs } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';
import { withBackgrounds } from '@storybook/addon-backgrounds';

import Ring from '../lib/svg/Ring';
import ShimmerText from '../lib/text/ShimmerText';
import Waves from '../lib/canvas/Waves';

setAddon(JSXAddon);

const withThemeBackgrounds = withBackgrounds([
  { name: 'white', value: '#fff', default: true },
  { name: 'black', value: '#000' },
]);

storiesOf('Ring', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
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
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addWithJSX('Default', () => <ShimmerText>Hello beautiful world gone awry</ShimmerText>)
  .addWithJSX('Duration', () => <ShimmerText duration={5}>Hello beautiful world gone awry</ShimmerText>)
  .addWithJSX('Knobs', () => <ShimmerText
    children={text('children', 'Hello beautiful world gone awry')}
    duration={number('duration', ShimmerText.defaultProps.duration)}
    waves={number('waves', ShimmerText.defaultProps.waves)}
  />);

storiesOf('Waves', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addWithJSX('Default', () => <Waves isActive={true} />);
