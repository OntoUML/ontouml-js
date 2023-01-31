import { Generalization } from '../ontouml';
import { VerificationIssue } from './';
export declare class GeneralizationVerification {
    static verifyGeneralization(generalization: Generalization): VerificationIssue[];
    static checkMinimalConsistency(generalization: Generalization): VerificationIssue[];
    static checkGeneralizationSortality(generalization: Generalization): VerificationIssue;
    static checkGeneralizationRigidity(generalization: Generalization): VerificationIssue;
    static checkGeneralizationDatatype(generalization: Generalization): VerificationIssue;
    static checkGeneralizationEnumeration(generalization: Generalization): VerificationIssue;
    static checkGeneralizationCompatibleNatures(generalization: Generalization): VerificationIssue;
}
