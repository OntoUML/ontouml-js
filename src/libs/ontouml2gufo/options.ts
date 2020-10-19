import { IElement } from '@types';
import { getName } from './helper_functions';

export default class Options {
  format: string;
  baseIri: string;
  basePrefix: string;
  uriFormatBy: string;
  createObjectProperty: boolean;
  createInverses: boolean;
  prefixPackages: boolean;
  customElementMapping?: {
    [key: string]: {
      label?: {
        [key: string]: string;
      };
      uri?: string;
    };
  };
  customPackageMapping?: {
    [key: string]: {
      prefix?: string;
      uri?: string;
    };
  };

  constructor(base: Partial<Options> = {}) {
    this.format = 'Turtle';
    this.baseIri = 'https://example.com';
    this.uriFormatBy = 'name';
    this.createObjectProperty = true;
    this.createInverses = false;
    this.prefixPackages = false;
    this.customElementMapping = {};
    this.customPackageMapping = {};

    Object.keys(base).forEach(key => (this[key] = base[key]));
  }

  getCustomUri(element: IElement): string {
    const allMappings = this.customElementMapping;

    let elementCustomMapping = allMappings[element.id];

    if (elementCustomMapping && elementCustomMapping.uri) {
      return elementCustomMapping.uri;
    }

    elementCustomMapping = allMappings[getName(element)];

    if (elementCustomMapping && elementCustomMapping.uri) {
      return elementCustomMapping.uri;
    }

    return null;
  }

  getCustomLabels(element: IElement) {
    const allMappings = this.customElementMapping;

    let elementCustomMapping = allMappings[element.id];

    if (elementCustomMapping && elementCustomMapping.label) {
      return elementCustomMapping.label;
    }

    elementCustomMapping = allMappings[getName(element)];

    if (elementCustomMapping && elementCustomMapping.label) {
      return elementCustomMapping.label;
    }

    return null;
  }
}
