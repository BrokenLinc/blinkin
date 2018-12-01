import { addDecorator, configure } from '@storybook/react';
import { withPropsTable } from 'storybook-addon-react-docgen';

addDecorator(withPropsTable);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
