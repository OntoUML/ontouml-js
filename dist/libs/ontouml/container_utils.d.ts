import { OntoumlElement } from '.';
declare function getContents(element: OntoumlElement, contentFields: string[], contentsFilter?: (content: OntoumlElement) => boolean): OntoumlElement[];
declare function getAllContents(element: OntoumlElement, contentFields: string[], contentsFilter?: (content: OntoumlElement) => boolean): OntoumlElement[];
declare function addContentToArray(element: OntoumlElement, arrayField: string, content: OntoumlElement): OntoumlElement;
declare function setContainer(element: OntoumlElement, container: OntoumlElement, containmentReference: string, isContainedInArray: boolean): void;
export declare const containerUtils: {
    getContents: typeof getContents;
    getAllContents: typeof getAllContents;
    addContentToArray: typeof addContentToArray;
    setContainer: typeof setContainer;
};
export {};
