import { DiagramElement } from './diagram_element';

export abstract class Shape extends DiagramElement {
  constructor(type: string, base?: Partial<Shape>) {
    super(type, base);
  }
}
