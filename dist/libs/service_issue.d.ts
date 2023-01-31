import { ServiceIssueSeverity } from './';
export interface ServiceIssue {
    id: string;
    code: string;
    severity: ServiceIssueSeverity;
    title: string;
    description: string;
    data: any;
}
