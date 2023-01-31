import { Node } from '../../ontouml2db/graph/Node';
import { Tracer } from '../../ontouml2db/tracker/Tracer';
import { TracedNode } from '../../ontouml2db/tracker/TracedNode';
export declare class GenerateObdaSource {
    static generate(tracer: Tracer, tracedNode: TracedNode): string;
    static getSelect(sourceNode: Node, tracedNode: TracedNode): string;
    static getFrom(tracer: Tracer, tracedNode: TracedNode): string;
    static getWhere(tracer: Tracer, tracedNode: TracedNode): string;
    static getFKFields(sourceNode: Node, targetNode: Node): string;
    static getStringValue(value: any): string;
}
