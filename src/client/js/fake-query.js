/**
 * Select one item that which matches query.
 *
 * @param {string} q - Query for querySelector
 * @return {(Element|null)}
 */
export const $ = q => document.querySelector(q);

/**
 * Select all items which matches query.
 *
 * @param {string} q - Query for querySelector
 * @return {(NodeListOf<(Element)>|null)}
 */
export const $$ = q => document.querySelectorAll(q);
