import singularType from './singularType.js';

export default function generateShareURL(type, id) {
  return `https://tidal.com/${singularType(type)}/${id}`;
}
