import { preAnalysis as preAnalysisModel } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';
import { IPreAnalysisItem } from '@types';

describe('PreAnalysis', () => {
  let preAnalysis;

  beforeAll(async () => {
    preAnalysis = (await transformOntoUML2GUFO(preAnalysisModel, {
      baseIRI: '://foo/',
      createInverses: true,
      preAnalysis: true,
      prefixPackages: true,
      customPackageMapping: {
        test: {
          prefix: 'test',
          uri: 'http://www.w3.org/2002/07/owl#',
        },
        'nQKxqY6D.AAAAQjF': {
          prefix: 'owl',
          uri: 'https://custom.com/owl#',
        },
      },
    })).preAnalysis;
  });

  it('should return invalid base IRI error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'invalid_base_iri');

    expect(items.length).toBe(1);
  });

  it('should return invalid custom package prefix error', () => {
    const items = preAnalysis.filter(
      (item: IPreAnalysisItem) => item.code === 'invalid_custom_package_prefix'
    );

    expect(items.length).toBe(1);
  });

  it('should return invalid custom package uri error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'invalid_custom_package_uri');

    expect(items.length).toBe(1);
  });

  it('should return invalid package prefix error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'invalid_package_prefix');

    expect(items.length).toBe(2);
  });

  it('should return inexistent relation name error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'missing_relation_name');

    expect(items.length).toBe(1);
  });

  it('should return inexistent inverse relation name error', () => {
    const items = preAnalysis.filter(
      (item: IPreAnalysisItem) => item.code === 'missing_inverse_relation_name'
    );

    expect(items.length).toBe(1);
  });

  it('should return repeated names error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'duplicate_names');

    expect(items.length).toBe(4);
  });

  it('should return inexistent source cardinality error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'missing_source_cardinality');

    expect(items.length).toBe(1);
  });

  it('should return inexistent target cardinality error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'missing_target_cardinality');

    expect(items.length).toBe(1);
  });

  it('should return inexistent attribute type error', () => {
    const items = preAnalysis.filter((item: IPreAnalysisItem) => item.code === 'missing_attribute_type');

    expect(items.length).toBe(2);
  });
});
