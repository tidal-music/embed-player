import singularType from './singularType.js';

/**
 * @typedef GenerateExternalLinkTextOptions
 * @prop {AnyTypeSingularOrPlural} type
 * @prop {boolean} [livestream]
 */

/**
 * @param {GenerateExternalLinkTextOptions} options
 */
export default function generateExternalLinkText(options) {
  let { livestream = false, type } = options;

  type = singularType(type);

  if (livestream) {
    return 'Continue watching';
  }

  const action = type === 'video' ? 'Watch' : 'Listen to';

  return action + ' full ' + type;
}
