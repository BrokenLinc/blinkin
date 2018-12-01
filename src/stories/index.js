import React from 'react';
import { storiesOf } from '@storybook/react';

import Ring from '../lib/svg/Ring';
import ShimmerText from '../lib/text/ShimmerText';

storiesOf('Ring', module)
  .add('Default', () => <Ring />)
  .add('Color', () => <Ring color="#6523e2" />)
  .add('Stroke', () => <Ring strokeWidth={24} strokeLinecap="round" />)
  .add('Angle', () => <Ring angle={120} />)
  .add('Size', () => <Ring size={40} />)
  .add('Timing', () => <Ring duration={4} />);

storiesOf('ShimmerText', module)
  .add('Default', () => <ShimmerText>Hello beautiful world gone awry</ShimmerText>)
  .add('Duration', () => <ShimmerText duration={5}>Hello beautiful world gone awry</ShimmerText>);
