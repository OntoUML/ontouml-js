import { ModelElement, Stereotype } from '..';
export declare abstract class Decoratable<S extends Stereotype> extends ModelElement {
    stereotype: S;
    constructor(type: string, base: Partial<Decoratable<S>>);
    abstract getAllowedStereotypes(): S[];
    isStereotypeValid(allowsNone?: boolean): boolean;
    hasAnyStereotype(stereotypes: S | S[]): boolean;
}
