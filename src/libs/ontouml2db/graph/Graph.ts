/**
 * The process turns the model of the UML file into a graph. This class
 * groups all the methods necessary to manipulate the graph.
 *
 * Author: Gustavo L. Guidoni
 */

import { Util } from './util/Util';
import { GraphRelation } from './GraphRelation';
import { GraphGeneralization } from './GraphGeneralization';
import { GraphAssociation } from './GraphAssociation';
import { GraphGeneralizationSet } from './GraphGeneralizationSet';
import { Node } from './Node';

export class Graph {
  private nodes: Node[];
  private associations: GraphAssociation[];
  private generalizationSets: GraphGeneralizationSet[];

  constructor(
    nodes?: Node[],
    associations?: GraphAssociation[],
    gs?: GraphGeneralizationSet[],
  ) {
    if (nodes) this.nodes = nodes;
    else this.nodes = [];

    if (associations) this.associations = associations;
    else this.associations = [];

    if (gs) this.generalizationSets = gs;
    else this.generalizationSets = [];
  }

  /**
   * Adds a new node (class) on the graph.
   *
   * @param Node. Node to be added in the graph.
   */
  addNode(newNode: Node): void {
    this.nodes.push(newNode);
  }

  /**
   * Returns the node instance. If not find, returns null.
   *
   * @param id. The class identifier of the original model.
   */
  getNodeById(id: string): Node {
    for (let val of this.nodes) {
      if (val.getId() == id) return val;
    }
    return null;
  }

  /**
   * Returns the node instance. If not find, returns null.
   *
   * @param name. The class name to search for.
   */
  getNodeByName(name: string): Node {
    let n: Node;

    for (let val of this.nodes) {
      if (val.getName() == name) return val;
    }
    return null;
  }

  /**
   * Returns all nodes of the graph.
   *
   * @return An array with all nodes.
   */
  getNodes(): Node[] {
    return this.nodes;
  }

  /**
   * Verifies whether the node exists on the graph.
   *
   * @param node. Node to be verified.
   * @return True if the node exists in the graph, otherwise false.
   */
  existsNode(node: Node): boolean {
    return this.nodes.includes(node);
  }

  /**
   * Adds a new relation to the graph.
   *
   * @param relation. The relation to be stored.
   */
  addRelation(relation: GraphRelation): void {
    if (this.getAssociationByID(relation.getAssociationID()) == null) {
      this.associations.push(relation);
    }
  }

  /**
   * Adds a new generalization to the graph.
   *
   * @param generalization. The generalization to be stored.
   */
  addGeneralization(generalization: GraphGeneralization): void {
    if (!this.associations.includes(generalization)) {
      this.associations.push(generalization);
    }
  }

  /**
   * Returns the associaiton of the respective ID.
   *
   * @param id Association ID.
   */
  addGeneralizationSet(generalizationSet: GraphGeneralizationSet): void {
    if (!this.generalizationSets.includes(generalizationSet)) {
      this.generalizationSets.push(generalizationSet);
    }
  }

  /**
   * Adds a new Generalization Set to the graph.
   *
   * @param generalizationSet. The generalization set to be stored.
   */
  getAssociationByID(id: string): GraphAssociation {
    for (let val of this.associations) {
      if (val.getAssociationID() == id) return val;
    }
    return null;
  }

  /**
   * Returns all associations of the graph.
   *
   * @return An array with all associations.
   */
  getAssociations(): GraphAssociation[] {
    return this.associations;
  }

  /**
   * Returns a top-level non-sortal in a package and remove it from array.
   *
   * @return An Node with the top-level non-sortal from the graph, or null
   * if none can be found
   */
  getToplevelNonSortal(): Node {
    for (let node of this.nodes) {
      if (
        Util.isNonSortal(node.getStereotype()) &&
        !node.isSpecialization() &&
        node.hasSpecialization() //Allows the generation of a table with a "non-sortal" without heirs.
      ) {
        return node;
      }
    }
    return null;
  }

  /**
   * Returns the first node that it finds to be non-kind.
   *
   * @return An Node non-kind.
   */
  getLeafSortalNonKind(): Node {
    for (let node of this.nodes) {
      if (
        Util.isSortalNonKind(node.getStereotype()) && //is a subkind, phase or role
        !node.hasSpecialization()
      ) {
        //is a leaf node
        return node;
      }
    }
    return null;
  }

  /**
   * Removes an node and its associations of the graph.
   *
   * @param node. Node to be removed.
   */
  removeNodes(nodes: Node[]): void {
    for (let node of nodes) {
      this.removeNode(node);
    }
  }

  /**
   * Removes set of nodes and its associations of the graph.
   *
   * @param node. Node to be removed.
   */
  removeNode(node: Node): void {
    let index = this.nodes.indexOf(node);
    this.nodes.splice(index, 1);

    let relation: GraphRelation;
    let removeRelations = node.getRelations();
    while (removeRelations.length != 0) {
      relation = removeRelations[0];
      index = this.associations.indexOf(relation);
      this.associations.splice(index, 1);
      relation.deleteAssociation();
    }

    let generalization: GraphGeneralization;
    let removeGeneralizations = node.getGeneralizations();
    while (removeGeneralizations.length != 0) {
      generalization = removeGeneralizations[0];
      index = this.associations.indexOf(generalization);
      this.associations.splice(index, 1);
      generalization.deleteAssociation();
    }
  }

  /**
   * Removes the association of the graph. The association will be removed from the nodes.
   *
   * @param association. Association to be removed.
   */
  removeAssociation(association: GraphAssociation): void {
    if (association instanceof GraphRelation) {
      this.removeRelation(association);
    }
    if (association instanceof GraphGeneralization) {
      this.removeGeneralization(association);
    }
    let index = this.associations.indexOf(association);
    if (index != -1) this.associations.splice(index, 1);
  }

  /**
   * Removes the associations of the graph. The associations will be removed from the nodes.
   *
   * @param associations. Associations to be removed.
   */
  removeAssociations(associations: GraphAssociation[]): void {
    for (let association of associations) {
      this.removeAssociation(association);
    }
  }

  /**
   * Marks all nodes as unsolved.
   */
  setAllNodesUnsolved(): void {
    this.nodes.forEach((node: Node) => {
      node.setResolved(false);
    });
    this.associations.forEach((association: GraphAssociation) => {
      association.setResolved(false);
    });
  }

  private removeRelation(relation: GraphRelation): void {
    relation.deleteAssociation();
  }

  private removeGeneralization(generalization: GraphGeneralization): void {
    generalization.deleteAssociation();
  }

  /**
   * Clone the graph by establishing a reference between the nodes of the current
   * graph for the cloned graph.
   *
   * @return An graph identical to the current graph.
   */
  clone(): Graph {
    let newNodes: Node[] = [];
    let newAssociations: GraphAssociation[] = [];
    let newGS: GraphGeneralizationSet[] = [];

    this.nodes.forEach((node: Node) => {
      newNodes.push(node.clone());
    });

    this.associations.forEach((association: GraphAssociation) => {
      newAssociations.push(association.cloneChangingReferencesTo(newNodes));
    });

    this.generalizationSets.forEach((gs: GraphGeneralizationSet) => {
      newGS.push(gs.cloneChangingReferencesTo(
        newNodes,
      ) as GraphGeneralizationSet);
    });

    return new Graph(newNodes, newAssociations, newGS);
  }

  toString(): string {
    let msg = '';

    this.nodes.forEach((node: Node) => {
      msg += node.toString() + '\n';
    });
    return msg;
  }
}
