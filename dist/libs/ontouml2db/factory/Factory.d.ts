import { Graph } from '../../ontouml2db/graph/Graph';
import { Cardinality } from '../../ontouml2db/constants/enumerations';
import { Project, ClassStereotype, Class } from '../../ontouml';
export declare class Factory {
    graph: Graph;
    project: Project;
    constructor(project: Project);
    mountGraph(): Graph;
    putClasses(): void;
    putClass(_class: Class): void;
    getAcceptNull(cardinality: string): boolean;
    getIsMultivalued(cardinality: string): boolean;
    getUfoStereotype(_class: Class): ClassStereotype;
    putRelations(): void;
    getCardinality(cardinality: string): Cardinality;
    getLowerBoundCardinality(cardinality: string): number;
    getUpperBoundCardinality(cardinality: string): number;
    putGeneralizations(): void;
    putGeneralizationSets(): void;
}
