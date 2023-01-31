import { Class } from '../ontouml';
import { VerificationIssue } from './';
export declare class ClassVerification {
    static verifyClass(_class: Class): VerificationIssue[];
    static checkMinimalConsistency(_class: Class): VerificationIssue[];
    static checkKindSpecialization(_class: Class): VerificationIssue;
    static checkCompatibleNatures(_class: Class): VerificationIssue;
    static checkMissingNatures(_class: Class): VerificationIssue;
    static checkMissingIsExtensional(_class: Class): VerificationIssue;
    static checkMissingIsPowertype(_class: Class): VerificationIssue;
    static checkMissingOrder(_class: Class): VerificationIssue;
}
