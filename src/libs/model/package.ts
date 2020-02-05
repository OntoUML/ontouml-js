import memoizee from 'memoizee';
import {
  PACKAGE_TYPE,
  CLASS_TYPE,
  RELATION_TYPE,
  GENERALIZATION_TYPE,
  GENERALIZATION_SET_TYPE,
} from '@constants/model_types';

/**
 * Class that represent a OntoUML element.
 */
export abstract class Element<T extends Element<any>> {
  type: string;
  id: string;
  name: string | null;
  description: string | null;
  container: T | null;

  constructor(
    type: string,
    id: string,
    enableMemoization = false,
    description?: string,
    name?: string,
    container?: T,
  ) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.description = description;
    this.container = container;

    if (enableMemoization) {
      this.getRootPackage = memoizee(this.getRootPackage);
    }
  }

  /**
   * Returns the outtermost container of an element.
   */
  getRootPackage(): Package {
    if (this.container) {
      let root: Package;
      root = this.container.getRootPackage();
      if (this instanceof Package && root === this) {
        throw 'Circular containment references';
      } else if (root) {
        return root;
      } else if (this.container instanceof Package) {
        return this.container;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

export abstract class Stereotyped<T extends Element<any>> extends Element<any> {
  stereotypes: Stereotype[] | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    stereotypes?: Stereotype[],
    container?: Package,
  ) {
    super(id, enableHash, name, description, container);
    this.stereotypes = stereotypes;

    if (enableHash) {
    }
  }
}

export abstract class Classifier extends Stereotyped<any> {
  properties: Property[] | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    properties?: Property[],
    stereotypes?: Stereotype[],
    container?: Package,
  ) {
    super(id, enableHash, name, description, stereotypes, container);
    this.properties = properties;

    if (enableHash) {
    }
  }
}

/**
 * Class that represents an OntoUML Package.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Package extends Element<Package> {
  authors: string[] | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    authors?: string[],
    contents?: Element<any>[],
    container?: Package,
  ) {
    super(id, enableHash, name, description, container);
    this.type = PACKAGE_TYPE;
    this.authors = authors;
    this.contents = contents;

    if (enableHash) {
      this.getAllContents = memoizee(this.getAllContents);
    }
  }

  getAllContents(): Element[] {
    var allElements = [...this.contents];

    this.contents.forEach(content => {
      allElements.push(content);
      if (content instanceof Package) {
        const innerContents = content.getAllContents();
        if (innerContents.includes(this)) {
          throw 'Circular containment references';
        }
        allElements = [...allElements, ...innerContents];
      } else if (content instanceof Classifier) {
        allElements = [...allElements, ...content.properties];
      }
    });

    return allElements;
  }
}

export class Class extends Classifier {}

export class Relation extends Classifier {}

export class Property extends Stereotyped<Classifier> {}

export class Generalization extends Element<Package> {}

export class GeneralizationSet extends Element<Package> {}

export class Stereotype extends Element<Stereotyped<any>> {}
