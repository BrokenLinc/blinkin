import React from 'react';
import { storiesOf } from '@storybook/react';
import { color, number, radios, select, text, withKnobs } from '@storybook/addon-knobs';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import ResizeDetector from 'react-resize-detector';

import Ring from '../lib/svg/Ring';
import ShimmerText from '../lib/text/ShimmerText';
import ArcSpinner from '../lib/canvas/ArcSpinner';
import Particles1 from '../lib/canvas/Particles1';
import Waves3 from '../lib/canvas/Waves3';

const withThemeBackgrounds = withBackgrounds([
  { name: 'white', value: '#fff', default: true },
  { name: 'black', value: '#000' },
]);

const LINEAR_GRADIENT = {
  OCEAN: {
    coords: [0, 0, 0, 120],
    colorStops: [
      { stop: 0, color: '#22BBEE' },
      { stop: 1, color: '#2222CC' },
    ],
  },
};

const LINE_CAP_RADIO_OPTIONS = {
  Butt: 'butt',
  Round: 'round',
  Square: 'square',
};

const LINE_CAP_SELECT_OPTIONS = ['butt', 'round', 'square'];

storiesOf('Canvas/ArcSpinner', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addDecorator((story) => <div className='centered-content'>{story()}</div> )
  .add('Default', () => <ArcSpinner />)
  .add('Custom', () => <ArcSpinner
    width={100}
    height={100}
    strokeWidth={16}
    lineCap="round"
    color={LINEAR_GRADIENT.OCEAN}
  />)
  .add('Controlled with Knobs', () => <ArcSpinner
    width={number('width', ArcSpinner.defaultProps.width, {}, 'Size')}
    height={number('height', ArcSpinner.defaultProps.height, {}, 'Size')}

    color={color('color', ArcSpinner.defaultProps.color, 'Style')}
    strokeWidth={number('strokeWidth', ArcSpinner.defaultProps.strokeWidth, {}, 'Style')}
    lineCap={radios('lineCap', LINE_CAP_RADIO_OPTIONS, ArcSpinner.defaultProps.lineCap, 'Style')}

    angleSpread={number('angleSpread', ArcSpinner.defaultProps.angleSpread, {}, 'Timing')}
    startSpeed={number('startSpeed', ArcSpinner.defaultProps.startSpeed, {}, 'Timing')}
    endSpeed={number('endSpeed', ArcSpinner.defaultProps.endSpeed, {}, 'Timing')}
  />);

storiesOf('Canvas/Particles1', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addDecorator((story) => <ResizeDetector handleHeight handleWidth>{story()}</ResizeDetector> )
  .add('Default', () => <Particles1 />)
  .add('Custom', () => <Particles1
    particleFill="#902"
    segmentColor="#0cf"
    segmentWidth={3}
    particleSize={20}
    particleStrokeWidth={4}
    particleStrokeColor="#f03"
  />)
  .add('Controlled with Knobs', () => <Particles1
    particleFill={color('particleFill', Particles1.defaultProps.particleFill, 'Style')}
    segmentColor={color('segmentColor', Particles1.defaultProps.segmentColor, 'Style')}
    segmentWidth={number('segmentWidth', Particles1.defaultProps.segmentWidth, {}, 'Style')}
    particleSize={number('particleSize', Particles1.defaultProps.particleSize, {}, 'Style')}
    particleStrokeWidth={number('particleStrokeWidth', Particles1.defaultProps.particleStrokeWidth, {}, 'Style')}
    particleStrokeColor={color('particleStrokeColor', Particles1.defaultProps.particleStrokeColor, 'Style')}
  />);

storiesOf('SVG/Ring', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .add('Default', () => <Ring />)
  .add('Color', () => <Ring color="#6523e2" />)
  .add('Stroke', () => <Ring strokeWidth={24} strokeLinecap="round" />)
  .add('Angle', () => <Ring angle={120} />)
  .add('Size', () => <Ring size={40} />)
  .add('Timing', () => <Ring duration={4} />)
  .add('Knobs', () => <Ring
    angle={number('angle', Ring.defaultProps.angle)}
    basis={number('basis', Ring.defaultProps.basis)}
    color={color('color', Ring.defaultProps.color)}
    duration={number('duration', Ring.defaultProps.duration)}
    size={number('size', Ring.defaultProps.size)}
    strokeLinecap={select('strokeLinecap', LINE_CAP_SELECT_OPTIONS)}
    strokeWidth={number('strokeWidth', Ring.defaultProps.strokeWidth)}
  />)
;

storiesOf('Text/ShimmerText', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .add('Default', () => <ShimmerText>Hello beautiful world gone awry</ShimmerText>)
  .add('Duration', () => <ShimmerText duration={5}>Hello beautiful world gone awry</ShimmerText>)
  .add('Knobs', () => <ShimmerText
    children={text('children', 'Hello beautiful world gone awry')}
    duration={number('duration', ShimmerText.defaultProps.duration)}
    waves={number('waves', ShimmerText.defaultProps.waves)}
  />);

storiesOf('Canvas/Waves3', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .add('Default', () => <Waves3 />);
