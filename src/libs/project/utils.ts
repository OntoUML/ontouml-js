import _ from 'lodash';

function includesAll<T>(superSet: T[], subSet: T[]): boolean {
  return _.isEmpty(_.difference(subSet, superSet));
}

function intersects<T>(setA: T[], setB: T[]): boolean {
  return !_.isEmpty(_.intersection(setA, setB));
}

export const utils = {
  includesAll,
  intersects
};
