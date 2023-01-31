import { OntoumlElement, NodeView, Rectangle, Package } from '..';
export declare class PackageView extends NodeView<Package, Rectangle> {
    constructor(base?: Partial<PackageView>);
    createShape(): Rectangle;
    getContents(): OntoumlElement[];
}
