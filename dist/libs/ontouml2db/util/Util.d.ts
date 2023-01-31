import { Node } from '../../ontouml2db/graph/Node';
import { ClassStereotype } from '../../ontouml';
import { Graph } from '../graph/Graph';
export declare class Util {
    static findNodeById(id: string, nodes: Node[]): Node;
    static isNonSortal(type: ClassStereotype): boolean;
    static isSortalNonKind(type: ClassStereotype): boolean;
    static getSpaces(name: string, qtd: number): string;
    static transformGeneralizationToRelation1to1(graph: Graph): void;
}
