import _ from 'lodash';

function includesAll<T>(superSet: T[], subSet: T[]): boolean {
  return !!superSet && !!subSet && _.isEmpty(_.difference(subSet, superSet));
}

function intersects<T>(setA: T[], setB: T[]): boolean {
  return !!setA && !!setB && !_.isEmpty(_.intersection(setA, setB));
}

function equalContents<T>(setA: Set<T>, setB: Set<T>): boolean;
function equalContents<T>(arrayA: T[], arrayB: T[]): boolean;
function equalContents<T>(a: T[] | Set<T>, b: T[] | Set<T>): boolean {
  if (!a || !b) {
    return false;
  }

  if (Array.isArray(a)) {
    a = new Set<T>(a);
  }

  if (Array.isArray(b)) {
    b = new Set<T>(b);
  }

  return a.size === b.size && [...a].every(content => (b as Set<T>).has(content));
}

function arrayFrom<T>(input: T | T[] | Set<T>): T[] {
  let resolvedInputArray: T[] = [];

  if (Array.isArray(input) && !_.isEmpty(input)) {
    resolvedInputArray = input;
  } else if (input instanceof Set) {
    resolvedInputArray = [...input];
  } else if (input) {
    resolvedInputArray = [input as T];
  }

  return resolvedInputArray;
}

export const utils = {
  includesAll,
  intersects,
  arrayFrom,
  equalContents
};
