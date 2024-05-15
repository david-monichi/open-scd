'use strict';

import { identity } from '@openscd/core/foundation/scl.js';
import { Delete } from '@openscd/core/foundation/deprecated/editor.js';

/**
 * Clean SCL items as requested by removing SCL elements specified from the SCL file
 * @param cleanItems - SCL elements to be removed from the SCL file
 * @returns an actions array to support undo/redo
 */
export function cleanSCLItems(cleanItems: Element[]): Delete[] {
  const actions: Delete[] = [];
  if (cleanItems) {
    cleanItems.forEach(item => {
      actions.push({
        old: {
          parent: <Element>item.parentElement!,
          element: item,
          reference: <Node | null>item!.nextSibling,
        },
      });
    });
  }
  return actions;
}

/**
 * Provide frequency count of elements.
 * @param arr - An array of elements
 * @returns a Map of element strings and frequencies
 */
export function countBy(arr: string[]): Map<string, number> {
  return arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
}

/**
 * Sort a list of Elements by their identity string.
 * @param elements - an array of Elements.
 * @returns a sorted list of elements.
 */
export function identitySort(elements: Element[]): Element[] {
  return elements.sort((a: Element, b: Element) => {
    // sorting using the identity ensures sort order includes IED and other useful properties
    const aId = identity(a);
    const bId = identity(b);
    if (aId < bId) {
      return -1;
    }
    if (aId > bId) {
      return 1;
    }
    // names must be equal
    return 0;
  });
}

/**
 * Return a de-duplicate set of array elements.
 * @param arr - an array of items with duplicates.
 * @returns an array of items without duplicates.
 */
export function uniq(arr: unknown[]): unknown[] {
  return Array.from(new Set(arr));
}
