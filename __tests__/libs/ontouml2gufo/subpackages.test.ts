import { IPackage } from '@types';
import { generateGufo, OntoumlFactory } from './helpers';

describe('Subpackages', () => {
  let model: IPackage;

  beforeEach(() => {
    const personClass = OntoumlFactory.createKind('Person');
    const universityPkg = OntoumlFactory.createPackage('University', [personClass]);
    model = OntoumlFactory.createPackage('Model', [personClass, universityPkg]);
  });

  describe('When { prefixPackages = true }', () => {
    it("should generate subpackage prefix based on the package's name", () => {
      const owlCode = generateGufo(model, { format: 'Turtle', prefixPackages: true });
      expect(owlCode).toContain('@prefix university:');
    });

    it("should generate subpackage URI based on the package's name and the supplied baseIri", () => {
      const owlCode = generateGufo(model, { format: 'Turtle', prefixPackages: true, baseIri: 'http://ontouml.org' });
      expect(owlCode).toContain('@prefix university: <http://ontouml.org/university#>');
    });

    it('should use the generated subpackage prefix for the elements the subpackage contains', () => {
      const owlCode = generateGufo(model, { format: 'Turtle', prefixPackages: true });
      expect(owlCode).toContain('university:Person');
    });
  });

  describe('When { prefixPackages = false }', () => {
    it("should NOT generate subpackage prefix based on the package's name", () => {
      const owlCode = generateGufo(model, { format: 'Turtle', prefixPackages: false });
      expect(owlCode).not.toContain('@prefix university:');
    });

    it('should use the default prefix for the elements the subpackage contains', () => {
      const owlCode = generateGufo(model, { format: 'Turtle', prefixPackages: false });
      expect(owlCode).toContain(':Person');
      expect(owlCode).not.toContain('university:Person');
    });
  });

  describe('When { prefixPackages = true } and there are custom mappings for packages', () => {
    it('should generate subpackage prefix equal to the provided value', () => {
      const owlCode = generateGufo(model, {
        format: 'Turtle',
        prefixPackages: true,
        customPackageMapping: {
          University: {
            prefix: 'uni'
          }
        }
      });
      expect(owlCode).toContain('@prefix uni:');
    });

    it('should generate subpackage URI equal to the provided value', () => {
      const owlCode = generateGufo(model, {
        format: 'Turtle',
        prefixPackages: true,
        customPackageMapping: {
          University: {
            uri: 'http://university.org/'
          }
        }
      });
      expect(owlCode).toContain('@prefix university: <http://university.org/');
    });

    it('should use the custom prefix for the elements the subpackage contains', () => {
      const owlCode = generateGufo(model, {
        format: 'Turtle',
        prefixPackages: true,
        customPackageMapping: {
          University: {
            prefix: 'uni'
          }
        }
      });
      expect(owlCode).toContain('uni:Person');
    });
  });
});
