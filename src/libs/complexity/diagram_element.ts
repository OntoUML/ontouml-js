import { IElement, IClass, IDiagramElement, IReference, IBackground, IPoint, IFont, ILine } from '@types';

export class DiagramElement implements IDiagramElement {
  type: string;
  id: string;
  source: IReference;
  field: string;
  points: IPoint[];
  font: IFont[];
  line: ILine[];
  background: IBackground;
  visibility: object;
  elements: IDiagramElement[];

  constructor(type: string, source: IElement) {
    const id = source.name ? source.name.replace(/\s/g, '-').toLowerCase() : source.id;

    this.type = type;
    this.id = id + '-' + type.toLowerCase();
    this.source = {
      type: source.type,
      id: source.id,
    };
    this.field = null;
    this.points = null;
    this.font = null;
    this.line = null;
    this.background = null;
    this.visibility = null;
    this.elements = null;
  }
}

export class Shape extends DiagramElement {
  constructor(source: IClass) {
    super('Shape', source);
  }
}

export class Line extends DiagramElement {
  constructor(source: IElement) {
    super('Line', source);
  }
}

export class Label extends DiagramElement {
  constructor(source: IElement) {
    super('Label', source);
  }
}
