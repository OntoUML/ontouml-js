import { Node } from '../../ontouml2db/graph/Node';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
import { TracedNode } from '../tracker/TracedNode';
export declare class GenerateObdaTarget {
    static generate(sourceNode: Node, project: string, tracedNode: TracedNode): string;
    static generateTarget(sourceNode: Node, project: string, tracedNode: TracedNode): string;
    static generateSource(sourceNode: Node, project: string, tracedNode: TracedNode): string;
    static generatePredicateAndObjects(sourceNode: Node, tracedNode: TracedNode): string;
    static generatePredicateFromProperty(property: NodeProperty): string;
    static generateObject(property: NodeProperty, tracedNode: TracedNode): string;
    static generateForeignKeyAssociations(project: string, tracedNode: TracedNode): string;
    static generateReferencedObject(property: NodeProperty, tracedNode: TracedNode): string;
    static generatePredicateFromAssociation(association: GraphAssociation): string;
    static getType(property: NodeProperty): string;
    static generateTargetNtoN(sourceNode: Node, project: string, tracedNode: TracedNode): string;
}
