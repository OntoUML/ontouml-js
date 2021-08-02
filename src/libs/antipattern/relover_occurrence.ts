// this is to define the general constructs making up the anti-pattern (RelOver in this case) #0

import { Class, Generalization, Relation, Diagram } from '@libs/ontouml';

export class RelOverOccurrence {
  relator: Class;
  mediations: Relation[];
  targets: Class[];
  ancestor: Class;

  constructor(relator: Class, mediations: Relation[], targets: Class[], ancestor: Class) {
    this.relator = relator;
    this.targets = targets;
    this.ancestor = ancestor;
    this.mediations = mediations;
    // this.createDiagram();
  }

  createDiagram(): Diagram {
    let diagram = new Diagram();
    diagram.setName('RelOver ' + this.relator.getName());
    // diagram.owner = owner;
    console.log(diagram);
    let pos: number = 40;
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
