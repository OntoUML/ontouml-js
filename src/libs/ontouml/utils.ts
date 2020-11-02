import _ from 'lodash';

function includesAll<T>(superSet: T[], subSet: T[]): boolean {
  return _.isEmpty(_.difference(subSet, superSet));
}

function intersects<T>(setA: T[], setB: T[]): boolean {
  return !_.isEmpty(_.intersection(setA, setB));
}

function arrayFromInputOrInputArray<T>(input: T | T[]): T[] {
  let resolvedInputArray: T[] = null;

  if (Array.isArray(input) && !_.isEmpty(input)) {
    resolvedInputArray = input;
  } else if (input) {
    resolvedInputArray = [input as T];
  }

  return resolvedInputArray;
}

export const utils = {
  includesAll,
  intersects,
  arrayFromInputOrInputArray
};
