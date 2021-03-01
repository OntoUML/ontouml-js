import { generateGufo, getIssues } from './helpers';
import { Package, Property } from '@libs/ontouml';
import { IssueType } from '@libs/ontouml2gufo';

describe('PreAnalysis', () => {
  it('should return invalid base IRI error', () => {
    const model = new Package();
    model.addName('My Ontology');

    model.createKind('Person');

    const issue = getIssues(model, { baseIri: 'aaa' })[0];

    expect(issue.code).toEqual(IssueType.INVALID_BASE_IRI.code);
    expect(issue.data.baseIri).toEqual('aaa');
  });

  it('should return invalid custom package prefix error', () => {
    const model = new Package();
    model.addName('My Ontology');

    const subpackage = model.createPackage('Subpackage');

    subpackage.createKind('Person');

    let options = { customPackageMapping: {} };
    options.customPackageMapping[subpackage.id] = {
      prefix: 'owl',
      uri: 'https://custom.com/owl#'
    };

    const issue = getIssues(model, options)[0];

    expect(issue.code).toEqual(IssueType.INVALID_CUSTOM_PACKAGE_PREFIX.code);
    expect(issue.data.prefix).toEqual('owl');
  });

  it('should return invalid custom package uri error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const subpackage = model.createPackage('Subpackage');

    subpackage.createKind('Person');

    let options = { customPackageMapping: {} };
    options.customPackageMapping[subpackage.id] = {
      prefix: 'test',
      uri: 'http://www.w3.org/2002/07/owl#'
    };

    const issue = getIssues(model, options)[0];

    expect(issue.code).toEqual(IssueType.INVALID_CUSTOM_PACKAGE_URI.code);
    expect(issue.data.uri).toEqual('http://www.w3.org/2002/07/owl#');
  });

  it('should return invalid package prefix error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const owlpackage = model.createPackage('owl');

    owlpackage.createKind('Person');

    const issue = getIssues(model, { prefixPackages: true })[0];

    expect(issue.code).toEqual(IssueType.INVALID_PACKAGE_PREFIX.code);
    expect(issue.data.prefix).toEqual('owl');
  });

  it('should return invalid package uri error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const owlpackage = model.createPackage('owl#');

    owlpackage.createKind('Person');

    const issues = getIssues(model, { baseIri: 'http://www.w3.org/2002/07', prefixPackages: true });
    const issue = issues.find((i) => i.code === IssueType.INVALID_PACKAGE_URI.code);

    expect(issue).toBeTruthy();
    expect(issue.data.uri).toEqual('http://www.w3.org/2002/07/owl#');
  });

  it('should return repeated names error: 2 classes named "Person"', () => {
    const model = new Package();
    model.addName('My Ontology');

    model.createKind('Person');
    model.createKind('Person');

    const issue = getIssues(model)[0];

    expect(issue.code).toEqual(IssueType.DUPLICATE_NAMES.code);
    expect(issue.description).toContain('"Person"');
    expect(issue.data.elements.length).toEqual(2);
  });

  it('should return repeated names error: 1 class and 1 attribute named "Person"', () => {
    const model = new Package();
    model.addName('My Ontology');
    const person = model.createKind('Person');
    person.createAttribute(person, 'Person');

    const issue = getIssues(model)[0];

    expect(issue.code).toEqual(IssueType.DUPLICATE_NAMES.code);
    expect(issue.description).toContain('"Person"');
    expect(issue.data.elements.length).toEqual(2);
  });

  it('should return missing relation name error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const person = model.createKind('Person');
    const knows = model.createMaterialRelation(person, person);

    const issue = getIssues(model)[0];

    expect(issue.code).toEqual(IssueType.MISSING_RELATION_NAME.code);
    expect(issue.data.element.id === knows.id);
  });

  it('should return missing inverse relation name error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const person = model.createKind('Person');
    const knows = model.createMaterialRelation(person, person, 'knows');

    const issue = getIssues(model, { createInverses: true })[0];

    expect(issue.code).toEqual(IssueType.MISSING_INVERSE_RELATION_NAME.code);
    expect(issue.data.element.id === knows.id);
  });

  it('should return missing source cardinality error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const person = model.createKind('Person');
    const knows = model.createMaterialRelation(person, person, 'knows');
    knows.getSourceEnd().cardinality = null;

    const issue = getIssues(model)[0];

    expect(issue.code).toEqual(IssueType.MISSING_SOURCE_CARDINALITY.code);
    expect(issue.data.element.name === 'knows');
  });

  it('should return missing target cardinality error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const person = model.createKind('Person');
    const knows = model.createMaterialRelation(person, person, 'knows');
    knows.getTargetEnd().cardinality = null;

    const issue = getIssues(model)[0];

    expect(issue.code).toEqual(IssueType.MISSING_TARGET_CARDINALITY.code);
    expect(issue.data.element.name === 'knows');
  });

  it('should return inexistent attribute type error', () => {
    const model = new Package();
    model.addName('My Ontology');
    const person = model.createKind('Person');
    person.createAttribute(null, 'name');
    const issue = getIssues(model)[0];

    expect(issue.code).toEqual(IssueType.MISSING_ATTRIBUTE_TYPE.code);
    expect(issue.data.attribute.name).toEqual('name');
  });
});
