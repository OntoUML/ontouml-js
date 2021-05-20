/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************

const scripts: string[] = [];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();



// ****************************************
export const test_037: TestResource = {
  title: '037 - Evaluate the transformatino for GENERIC dbms without lookup table for enumerations.',
  project,
  scripts,
  obdaMapping,
};
