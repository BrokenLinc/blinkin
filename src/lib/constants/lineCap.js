import map from 'lodash/map';

const LINE_CAP = {
  BUTT: 'butt',
  ROUND: 'round',
  SQUARE: 'square',
};

export const LINE_CAPS = map(LINE_CAP, value => value);

export default LINE_CAP;
