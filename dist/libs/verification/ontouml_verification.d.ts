import { ModelElement, Project } from '../ontouml';
import { VerificationIssue } from '../verification';
import { Service, ServiceOptions } from './..';
export interface VerificationOptions extends ServiceOptions {
}
export declare class OntoumlVerification implements Service {
    elementToVerify: ModelElement | Project;
    options: VerificationOptions;
    issues: VerificationIssue[];
    constructor(project: Project, options?: Partial<VerificationOptions>);
    constructor(elementToVerify: ModelElement, options?: Partial<VerificationOptions>);
    run(): {
        result: VerificationIssue[];
    };
    static verify(element: ModelElement | Project): VerificationIssue[];
}
