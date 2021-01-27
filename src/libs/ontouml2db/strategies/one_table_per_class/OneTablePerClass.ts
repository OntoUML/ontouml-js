import { IStrategy } from '@libs/ontouml2db/strategies/IStrategy';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { GraphGeneralization } from '@libs/ontouml2db/graph/GraphGeneralization';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Increment } from '@libs/ontouml2db/util/Increment';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';

export class OneTablePerClass implements IStrategy {
  run(graph: Graph): void {
    let generalization: GraphGeneralization;
    let newRelation: GraphRelation;
    let id: string;
    let toDestroy: GraphGeneralization[] = [];

    for (let association of graph.getAssociations()) {
      if (association instanceof GraphGeneralization) {
        generalization = association;

        id = Increment.getNext().toString();

        newRelation = new GraphRelation(
          id, //ID
          id, //association name
          generalization.getGeneral(), //sourceNode
          Cardinality.C1, //sourceCardinality
          generalization.getSpecific(), //targetNode
          Cardinality.C1, //targetCardinality
        );

        generalization.getGeneral().addRelation(newRelation);
        generalization.getSpecific().addRelation(newRelation);
        graph.addRelation(newRelation);

        //graph.removeAssociation( generalization );
        toDestroy.push(generalization);
      }
    }

    for (generalization of toDestroy) {
      graph.removeAssociation(generalization);
    }
  }
}
