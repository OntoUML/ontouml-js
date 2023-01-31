import { Ontouml2DbOptions } from '../../ontouml2db/Ontouml2DbOptions';
import { Tracker } from '../../ontouml2db/tracker/Tracker';
export declare class GenerateObda {
    static getFile(options: Ontouml2DbOptions, tracker: Tracker): string;
    static generatePrefixDeclaration(options: Ontouml2DbOptions): string;
    static generateMappingDeclaration(options: Ontouml2DbOptions, tracker: Tracker): string;
}
