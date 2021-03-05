/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { countPattern, removeBlankSpaces } from './functions';

export class ScriptChecker {
  private script: string;
  private msg: string;

  constructor(script: string, msg: string) {
    this.script = removeBlankSpaces(script);
    this.msg = msg;
  }

  check(schema: string): string {
    if (countPattern(schema, this.script) != 1) {
      return this.msg;
    } else {
      return '';
    }
  }
}
