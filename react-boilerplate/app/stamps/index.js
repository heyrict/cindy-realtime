import stampA from './images/A.png';
import stampQ from './images/Q.png';
import stampANeko from './images/A-neko.png';
import stampQNeko from './images/Q-neko.png';

import stampGJ from './images/GJ.png';
import stampSanka from './images/sanka.png';
import stampPekori from './images/pekori.png';
import stampTanoshi from './images/tanoshi.png';
import stampYodare from './images/yodare.png';
import stampNanto from './images/nanto.png';

const m = (alt, src) =>
  `<img class="cindy-stamp-middle" alt=" :${alt}: " src="${src}" />`;

export const chatStamps = {
  'stamp-gj': stampGJ,
  'stamp-sanka': stampSanka,
  'stamp-tanoshi': stampTanoshi,
  'stamp-pekori': stampPekori,
  'stamp-yodare': stampYodare,
  'stamp-nanto': stampNanto,
};

export const puzzleStamps = {
  'stamp-q': stampQ,
  'stamp-a': stampA,
  'stamp-q-neko': stampQNeko,
  'stamp-a-neko': stampANeko,
};

const stampDefs = {
  'stamp-a': m('stamp-a', stampA),
  'stamp-q': m('stamp-q', stampQ),
  'stamp-q-neko': m('stamp-q-neko', stampQNeko),
  'stamp-a-neko': m('stamp-a-neko', stampANeko),
  'stamp-gj': m('stamp-gj', stampGJ),
  'stamp-sanka': m('stamp-sanka', stampSanka),
  'stamp-tanoshi': m('stamp-tanishi', stampTanoshi),
  'stamp-pekori': m('stamp-pekori', stampPekori),
  'stamp-yodare': m('stamp-yodare', stampYodare),
  'stamp-nanto': m('stamp-nanto', stampNanto),
};

export default stampDefs;
