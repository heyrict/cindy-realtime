import stampA from './images/A.jpg';
import stampGJ from './images/GJ.jpg';
import stampQ from './images/Q.jpg';
import stampSanka from './images/sanka.jpg';

const m = (alt, src) =>
  `<img class="cindy-stamp-middle" alt="${alt}" src="${src}" />`;

export const stamps = {
  'stamp-a': stampA,
  'stamp-q': stampQ,
  'stamp-gj': stampGJ,
  'stamp-sanka': stampSanka,
};

const stampDefs = {
  'stamp-a': m('stamp-a', stampA),
  'stamp-q': m('stamp-q', stampQ),
  'stamp-gj': m('stamp-gj', stampGJ),
  'stamp-sanka': m('stamp-sanka', stampSanka),
};

export default stampDefs;
