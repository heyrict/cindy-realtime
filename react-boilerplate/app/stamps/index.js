import stampA from './images/A.png';
import stampQ from './images/Q.png';
import stampANeko from './images/A-neko.png';
import stampQNeko from './images/Q-neko.png';
import stampHint from './images/hint.png';

import stampGJ from './images/GJ.png';
import stampSanka from './images/sanka.png';
import stampPekori from './images/pekori.png';
import stampTanoshi from './images/tanoshi.png';
import stampYodare from './images/yodare.png';
import stampNanto from './images/nanto.png';
import stampSounan from './images/sounan.png';
import stampItadaku from './images/itadaku.png';
import stampChira from './images/chira.png';
import stampDeath from './images/death.png';

const m = (alt, src) =>
  `<img class="cindy-stamp-middle" alt=" :${alt}: " src="${src}" />`;

export const chatStamps = {
  'stamp-gj': stampGJ,
  'stamp-sanka': stampSanka,
  'stamp-tanoshi': stampTanoshi,
  'stamp-pekori': stampPekori,
  'stamp-yodare': stampYodare,
  'stamp-nanto': stampNanto,
  'stamp-sounan': stampSounan,
  'stamp-itadaku': stampItadaku,
  'stamp-chira': stampChira,
  'stamp-death': stampDeath,
};

export const puzzleStamps = {
  'stamp-q': stampQ,
  'stamp-a': stampA,
  'stamp-q-neko': stampQNeko,
  'stamp-a-neko': stampANeko,
  'stamp-hint': stampHint,
};

const stampDefs = {
  'stamp-a': m('stamp-a', stampA),
  'stamp-q': m('stamp-q', stampQ),
  'stamp-q-neko': m('stamp-q-neko', stampQNeko),
  'stamp-a-neko': m('stamp-a-neko', stampANeko),
  'stamp-hint': m('stamp-hint', stampHint),
  'stamp-gj': m('stamp-gj', stampGJ),
  'stamp-sanka': m('stamp-sanka', stampSanka),
  'stamp-tanoshi': m('stamp-tanishi', stampTanoshi),
  'stamp-pekori': m('stamp-pekori', stampPekori),
  'stamp-yodare': m('stamp-yodare', stampYodare),
  'stamp-nanto': m('stamp-nanto', stampNanto),
  'stamp-sounan': m('stamp-sounan', stampSounan),
  'stamp-itadaku': m('stamp-itadaku', stampItadaku),
  'stamp-chira': m('stamp-chira', stampChira),
  'stamp-death': m('stamp-death', stampDeath),
};

export default stampDefs;
