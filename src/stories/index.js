import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import ResizeDetector from 'react-resize-detector';

import AutoKnobs from '../lib/util/AutoKnobs';
import Ring from '../lib/svg/Ring';
import ArcSpinner from '../lib/canvas/ArcSpinner';
import GlowSpinner from '../lib/canvas/GlowSpinner';
import Particles1 from '../lib/canvas/Particles1';
import Waves3 from '../lib/canvas/Waves3';

const withThemeBackgrounds = withBackgrounds([
  { name: 'white', value: '#fff', default: true },
  { name: 'black', value: '#000' },
]);

// const LINEAR_GRADIENT = {
//   OCEAN: {
//     coords: [0, 0, 0, 120],
//     colorStops: [
//       { stop: 0, color: '#22BBEE' },
//       { stop: 1, color: '#2222CC' },
//     ],
//   },
// };

storiesOf('Canvas/ArcSpinner', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addDecorator((story) => <div className='centered-content'>{story()}</div> )
  .add('Default', () => <ArcSpinner />)
  .add('Custom', () => <ArcSpinner {...ArcSpinner.demoProps} />)
  .add('Controlled with Knobs', () => <AutoKnobs component={ArcSpinner} />);

storiesOf('Canvas/GlowSpinner', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addDecorator((story) => <div className='centered-content'>{story()}</div> )
  .add('Default', () => <GlowSpinner />)
  .add('Custom', () => <GlowSpinner {...GlowSpinner.demoProps} />)
  .add('Controlled with Knobs', () => <AutoKnobs component={GlowSpinner} />);

storiesOf('Canvas/Particles1', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addDecorator((story) => <ResizeDetector handleHeight handleWidth>{story()}</ResizeDetector> )
  .add('Default', () => <Particles1 />)
  .add('Custom', () => <Particles1 {...Particles1.demoProps} />)
  .add('Controlled with Knobs', () => <AutoKnobs component={Particles1} />);

storiesOf('SVG/Ring', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .addDecorator((story) => <div className='centered-content'>{story()}</div> )
  .add('Default', () => <Ring />)
  .add('Custom', () => <Ring {...Ring.demoProps} />)
  .add('Controlled with Knobs', () => <AutoKnobs component={Ring} />);

storiesOf('Canvas/Waves3', module)
  .addDecorator(withKnobs)
  .addDecorator(withThemeBackgrounds)
  .add('Default', () => <Waves3 />)
  .add('Custom', () => <Waves3 {...Waves3.demoProps} />)
  .add('Stacked & Randomized', () => (
    <div style={{ position: 'relative', height: 320, width: 320 }}>
      <Waves3 {...Waves3.getRandomProps()} style={{ position: 'absolute', height: '100%', width: '100%' }} />
      <Waves3 {...Waves3.getRandomProps()} style={{ position: 'absolute', height: '100%', width: '100%' }} />
      <Waves3 {...Waves3.getRandomProps()} style={{ position: 'absolute', height: '100%', width: '100%' }} />
    </div>
  ))
  .add('Controlled with Knobs', () => <AutoKnobs component={Waves3} />);
