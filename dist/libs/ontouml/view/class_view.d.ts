import { NodeView, Rectangle, Class, OntoumlElement } from '..';
export declare class ClassView extends NodeView<Class, Rectangle> {
    constructor(base?: Partial<ClassView>);
    createShape(): Rectangle;
    getContents(): OntoumlElement[];
}
