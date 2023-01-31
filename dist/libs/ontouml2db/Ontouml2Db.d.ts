import { Graph } from '../ontouml2db/graph/Graph';
import { Ontouml2DbOptions } from '../ontouml2db/Ontouml2DbOptions';
import { Tracker } from '../ontouml2db/tracker/Tracker';
import { Project } from '../ontouml';
import { Service, ServiceIssue } from '..';
export declare class Ontouml2Db implements Service {
    private graph;
    private tracker;
    private options;
    constructor(project: Project, opt?: Partial<Ontouml2DbOptions>);
    run(): {
        result: any;
        issues?: ServiceIssue[];
    };
    validate(): void;
    doMapping(): void;
    transformToEntityRelationship(): void;
    getRelationalSchema(): string;
    getOBDAFile(): string;
    getProtegeConnection(): string;
    getSourceGraph(): Graph;
    getTracker(): Tracker;
    getOptions(): Ontouml2DbOptions;
}
