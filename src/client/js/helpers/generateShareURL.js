import singularType from './singularType.js';

export default function generateShareURL(type, id) {
  return `https://tidal.com/browse/${singularType(type)}/${id}`;
}
