import _ from 'lodash';
import { OntoumlElement } from './ontouml_element';
import { ProjectElement } from './project_element';

/**
 * Asserts that the value is neither null nor undefined.
 *
 * @throws an error if the value is null or undefined.
 */
function assertValue(value: any): void {
  if (_.isNil(value)) {
    throw new Error('Input value is null or undefined.');
  }
}

/**
 * Asserts that the array is defined and free of null or undefined members.
 *
 * @throws an error if the array is null, undefined, or contains a null or
 *         undefined member.
 */
function assertArray(array: any[]): void {
  if (!isValidArray(array)) {
    throw new Error(
      'Array is null, undefined, or contains a null or undefined member. \n' +
        JSON.stringify(array)
    );
  }
}

/**
 * Checks whether the array is defined and free of null or undefined members.
 *
 * @returns `true` if the array is not undefined, not null, and does not
 *          contain null or undefined values.
 */
function isValidArray(array: any[]): boolean {
  return !_.isNil(array) && !includesNil(array);
}

/** Checks whether the array contains a null or undefined member. */
function includesNil(array: any[]): boolean {
  return array.some(x => _.isNil(x));
}

/**
 * Checks whether every member of `subSet` is also a member of `superSet`.
 *
 * @returns `true` if both arrays are defined and `superSet` includes every
 *          member of `subSet`.
 */
function includesAll<T>(superSet: T[], subSet: T[]): boolean {
  return !!superSet && !!subSet && _.isEmpty(_.difference(subSet, superSet));
}

/**
 * Checks whether the two arrays have at least one member in common.
 *
 * @returns `true` if both arrays are defined and share a member.
 */
function intersects<T>(setA: T[], setB: T[]): boolean {
  return !!setA && !!setB && !_.isEmpty(_.intersection(setA, setB));
}

/**
 * Checks whether the two collections contain exactly the same members,
 * regardless of order and duplicates.
 *
 * @returns `true` if both collections are defined and contain the same
 *          members.
 */
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

  return (
    a.size === b.size && [...a].every(content => (b as Set<T>).has(content))
  );
}

/**
 * Normalizes the input into an array: arrays are returned as-is, sets are
 * spread into a new array, single values are wrapped in an array, and nil
 * values yield an empty array.
 */
function arrayFrom<T>(input: T | readonly T[] | Set<T>): T[] {
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

/**
 * Removes from the list, in place, every element whose `id` matches that of
 * `element`.
 */
function removeById(list: OntoumlElement[], element: OntoumlElement) {
  _.remove(list, member => member.id === element.id);
}

/**
 * Asserts that all listed elements belong to the same {@link Project}.
 *
 * @throws an error if the elements belong to different projects.
 */
function assertSameProject(...elements: ProjectElement[]): void {
  const projectIds = new Set(elements.map(e => e.project.id));

  if (projectIds.size != 1) {
    throw new Error('Listed elements are not contained by the same project.');
  }
}

/**
 * General-purpose assertion and collection helpers used throughout the
 * library.
 */
export const utils = {
  includesNil,
  includesAll,
  isValidArray,
  assertArray,
  assertValue,
  intersects,
  arrayFrom,
  equalContents,
  removeById,
  assertSameProject
};
