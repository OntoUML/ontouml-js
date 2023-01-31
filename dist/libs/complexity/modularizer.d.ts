import { Class, GeneralizationSet, Generalization, Diagram, Project } from '../ontouml';
import { Service } from '../service';
import { ServiceIssue } from '../service_issue';
import { Module } from './module';
export declare class Modularizer implements Service {
    project: Project;
    constructor(project: Project, _options?: any);
    run(): {
        result: any;
        issues?: ServiceIssue[];
    };
    buildAll(): Diagram[];
    buildModule(id: string, relator: Class): Module;
    static getRelatorChain(relator: Class): Module;
    private static traverseRelatorChain;
    static getNonSortalLine(nonSortal: Class): Class[];
    private static traverseNonSortalLine;
    getGeneralizationSetsFrom(referenceGens: Generalization[]): GeneralizationSet[];
}
