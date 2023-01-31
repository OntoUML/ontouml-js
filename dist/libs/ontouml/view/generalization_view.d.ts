import { ConnectorView, Path, Generalization } from '..';
export declare class GeneralizationView extends ConnectorView<Generalization> {
    constructor(base?: Partial<GeneralizationView>);
    createShape(): Path;
}
