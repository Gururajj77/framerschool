import { initTheme } from './theme';
import { initCube } from './motion';
import { initAnswers } from './faq';
import { initVideos } from './videos';
import { initCopy } from './copy';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initTheme();
initCube(reduced);
initAnswers();
initVideos();
initCopy();
