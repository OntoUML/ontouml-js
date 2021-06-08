import { Class, Generalization, Relation, Diagram } from '@libs/ontouml';

export class RelOverOccurrence {
  relator: Class;

  constructor(relator: Class) {
    this.relator = relator;
  }

  createDiagram(): Diagram {
    let diagram = new Diagram();
    diagram.setName("RelOver "+this.relator.getName());
    // diagram.owner = owner;

    // let pos: number = 40;
    // this?.classes.forEach(_class => {
    //   let view = diagram.addClass(_class);
    //   view.setX(pos);
    //   view.setY(40);
    //   pos += 120;
    // });

    // diagram.addModelElements(this.relations);
    // diagram.addModelElements(this.generalizations);
    // diagram.addModelElements(this.generalizationSets);

    return diagram;
  }
}
