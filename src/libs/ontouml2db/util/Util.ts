/**
 *
 * Author: Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { ClassStereotype } from '@constants/.';

export class Util {
  static findNodeById(id: string, nodes: Node[]): Node {
    let i: number = 0;

    while (i < nodes.length) {
      if (nodes[i].getId() === id) return nodes[i];
      i++;
    }
    return null;
  }

  static isNonSortal(type: ClassStereotype): boolean {
    if (
      type === ClassStereotype.CATEGORY ||
      type === ClassStereotype.ROLE_MIXIN ||
      type === ClassStereotype.PHASE_MIXIN ||
      type === ClassStereotype.MIXIN
    )
      return true;
    else return false;
  }

  static isSortalNonKind(type: ClassStereotype): boolean {
    if (
      type === ClassStereotype.ROLE ||
      type === ClassStereotype.PHASE ||
      type === ClassStereotype.SUBKIND
    )
      return true;
    else return false;
  }

  static getSpaces(name: string, qtd: number): string {
    let tam: number = name.length;
    let spaces: string;

    spaces = ' ';
    tam++;

    while (tam <= qtd) {
      spaces += ' ';
      tam++;
    }
    return spaces;
  }
}
