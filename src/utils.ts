import _ from 'lodash';
import { OntoumlElement } from './ontouml_element';
import { ProjectElement } from './project_element';

/**
 *
 * Checks if the value is null or undefined.
 * If it is, it throws an error.
 */
function assertValue(value: any): void {
  if (_.isNil(value)) {
    throw new Error('Input value is null or undefined.');
  }
}

/**
 *
 * Checks if the array is null, undefined, or contains a null or undefined member.
 * If it is, it throws an error.
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
 * @returns true if the array is not undefined, not null, and does not contain null or undefined values.
 */
function isValidArray(array: any[]): boolean {
  return !_.isNil(array) && !includesNil(array);
}

function includesNil(array: any[]): boolean {
  return array.some(x => _.isNil(x));
}

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

  return (
    a.size === b.size && [...a].every(content => (b as Set<T>).has(content))
  );
}

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

function removeById(list: OntoumlElement[], element: OntoumlElement) {
  _.remove(list, member => member.id === element.id);
}

function assertSameProject(...elements: ProjectElement[]): void {
  const projectIds = new Set(elements.map(e => e.project.id));

  if (projectIds.size != 1) {
    throw new Error('Listed elements are not contained by the same project.');
  }
}

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
