/**
 * @param {AnyTypeSingularOrPlural} type
 * @return {SingularType}
 */
export default function singularType(type) {
  const typeIsAlreadySingular = type.substr(-1) !== 's';
  const finalType = typeIsAlreadySingular ? type : type.slice(0, -1);

  if (
    finalType === 'album' ||
    finalType === 'playlist' ||
    finalType === 'artist' ||
    finalType === 'track' ||
    finalType === 'mix' ||
    finalType === 'video'
  ) {
    return finalType;
  }

  throw new Error(`Error when creating singular type from ${type}`);
}
