import UriManager from './uri_manager';

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
  uriManager: UriManager;

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
    this.uriManager = new UriManager();
  }
}
