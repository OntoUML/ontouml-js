import { Cardinality } from '../../ontouml2db/constants/enumerations';
import { Graph } from '../../ontouml2db/graph/Graph';
import { GraphRelation } from '../../ontouml2db/graph/GraphRelation';
import { Node } from '../../ontouml2db/graph/Node';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
export declare class SolvesForeignKey {
    static solves(graph: Graph): void;
    static removePKFromTargetNode1To1(graph: Graph): void;
    static propagateForeignKey(graph: Graph): void;
    static resolve1To1(relations: GraphRelation[]): void;
    static resolve1ToN(relations: GraphRelation[]): void;
    static is1ToN(relation: GraphRelation): boolean;
    static isNTo1(relation: GraphRelation): boolean;
    static is1To1(relation: GraphRelation): boolean;
    static propagateKey(from: Node, cardinalityFrom: Cardinality, to: Node, relation: GraphRelation): void;
    static getNewFKName(prop: NodeProperty, relation: GraphRelation, nodeFrom: Node): string;
}
