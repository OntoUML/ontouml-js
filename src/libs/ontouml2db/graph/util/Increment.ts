/**
 *
 * Author: Gustavo L. Guidoni
 */

export class Increment {
  private static next: number;

  public static getNext(): number {
    if (this.next == null) this.next = 1;
    return this.next++;
  }
}
