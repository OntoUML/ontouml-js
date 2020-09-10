/**
 *
 * Author: Gustavo L. Guidoni
 */

export class Increment {
  private static next: number;

  static getNext(): number {
    if (Increment.next == null) this.next = 1;
    return Increment.next++;
  }
}
