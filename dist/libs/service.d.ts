import { ServiceIssue } from './';
export interface Service {
    run(): {
        result: any;
        issues?: ServiceIssue[];
    };
}
