/** YouTube channel — update when the FramerSchool channel URL is final. */
export const YOUTUBE_URL = 'https://www.youtube.com/@FramerSkool';

export const CONTACT_EMAIL = 'framerskool@gmail.com';

/**
 * The six faces of the cube, in turning order: the four sides first,
 * then the top, then the bottom. The nav, progress squares and URL hashes
 * all follow this list. `color` names a face colour token in tokens.css.
 */
export const FACES = [
  { id: 'index', label: 'Index', color: 'red' },
  { id: 'method', label: 'Method', color: 'yellow' },
  { id: 'niches', label: 'Niches', color: 'blue' },
  { id: 'learn', label: 'Learn', color: 'pink' },
  { id: 'videos', label: 'Videos', color: 'purple' },
  { id: 'contact', label: 'Contact', color: 'lime' },
] as const;

export type FaceId = (typeof FACES)[number]['id'];

/** "01" … "06" */
export const faceNumber = (id: FaceId) =>
  String(FACES.findIndex((face) => face.id === id) + 1).padStart(2, '0');
