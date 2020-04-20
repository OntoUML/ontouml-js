import { packages as packagesModel } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';
import { IPreAnalysisItem } from '@types';

describe('PreAnalysis', () => {
  let packagesAnalysis;

  beforeAll(async () => {
    packagesAnalysis = (await transformOntoUML2GUFO(packagesModel, {
      baseIRI: '://foo/',
      preAnalysis: true,
      createInverses: true,
      customPackageMapping: {
        ZPFjgI6GAqACCQyA: {
          prefix: 'rdfs',
          uri: 'https://custom.com/rdfs#',
        },
        School: {
          prefix: 'customSchool',
          uri: 'http://www.w3.org/2002/07/owl#',
        },
      },
    })).preAnalysis;
  });

  it('should return invalid base IRI error', () => {
    const invalidBaseIRI = packagesAnalysis.filter(
      (item: IPreAnalysisItem) => item.code === 'invalid_base_iri',
    );

    expect(invalidBaseIRI.length).toBe(1);
  });

  it('should return invalid custom package prefix error', () => {
    const invalidPackagePrefixes = packagesAnalysis.filter(
      (item: IPreAnalysisItem) => item.code === 'invalid_custom_package_prefix',
    );

    expect(invalidPackagePrefixes.length).toBe(1);
  });

  it('should return invalid custom package uri error', () => {
    const invalidPackagePrefixes = packagesAnalysis.filter(
      (item: IPreAnalysisItem) => item.code === 'invalid_custom_package_uri',
    );

    expect(invalidPackagePrefixes.length).toBe(1);
  });
});
