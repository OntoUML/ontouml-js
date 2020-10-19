import { RelationStereotype } from '@constants/.';
import { IssueType } from '@libs/ontouml2gufo/issue';
import { getIssues } from './helpers';
import OntoumlFactory from './ontouml_factory';

describe('PreAnalysis', () => {
  it('should return invalid base IRI error', () => {
    const person = OntoumlFactory.createKind('Person');
    const ontology = OntoumlFactory.createPackage('My Ontology', [person]);
    const issue = getIssues(ontology, { baseIri: 'aaa' })[0];

    expect(issue.code).toEqual(IssueType.INVALID_BASE_IRI.code);
    expect(issue.data.baseIri).toEqual('aaa');
  });

  it('should return invalid custom package prefix error', () => {
    const person = OntoumlFactory.createKind('Person');
    const subPackage = OntoumlFactory.createPackage('Subpackage', [person]);
    const ontology = OntoumlFactory.createPackage('My Ontology', [subPackage]);

    let options = { customPackageMapping: {} };
    options.customPackageMapping[subPackage.id] = {
      prefix: 'owl',
      uri: 'https://custom.com/owl#'
    };

    const issue = getIssues(ontology, options)[0];

    expect(issue.code).toEqual(IssueType.INVALID_CUSTOM_PACKAGE_PREFIX.code);
    expect(issue.data.prefix).toEqual('owl');
  });

  it('should return invalid custom package uri error', () => {
    const person = OntoumlFactory.createKind('Person');
    const subPackage = OntoumlFactory.createPackage('Subpackage', [person]);
    const ontology = OntoumlFactory.createPackage('My Ontology', [subPackage]);

    let options = { customPackageMapping: {} };
    options.customPackageMapping[subPackage.id] = {
      prefix: 'test',
      uri: 'http://www.w3.org/2002/07/owl#'
    };

    const issue = getIssues(ontology, options)[0];

    expect(issue.code).toEqual(IssueType.INVALID_CUSTOM_PACKAGE_URI.code);
    expect(issue.data.uri).toEqual('http://www.w3.org/2002/07/owl#');
  });

  it('should return invalid package prefix error', () => {
    const person = OntoumlFactory.createKind('Person');
    const owlPackage = OntoumlFactory.createPackage('owl', [person]);
    const ontology = OntoumlFactory.createPackage('My Ontology', [owlPackage]);

    const issue = getIssues(ontology, { prefixPackages: true })[0];

    expect(issue.code).toEqual(IssueType.INVALID_PACKAGE_PREFIX.code);
    expect(issue.data.prefix).toEqual('owl');
  });

  it('should return invalid package uri error', () => {
    const person = OntoumlFactory.createKind('Person');
    const owlPackage = OntoumlFactory.createPackage('owl#', [person]);
    const ontology = OntoumlFactory.createPackage('My Ontology', [owlPackage]);

    const issues = getIssues(ontology, { baseIri: 'http://www.w3.org/2002/07', prefixPackages: true });
    const issue = issues.find(i => i.code === IssueType.INVALID_PACKAGE_URI.code);

    expect(issue).toBeTruthy();
    expect(issue.data.uri).toEqual('http://www.w3.org/2002/07/owl#');
  });

  it('should return repeated names error: 2 classes named "Person"', () => {
    const person = OntoumlFactory.createKind('Person');
    const person2 = OntoumlFactory.createKind('Person');
    const ontology = OntoumlFactory.createPackage('My Ontology', [person, person2]);

    const issue = getIssues(ontology)[0];

    expect(issue.code).toEqual(IssueType.DUPLICATE_NAMES.code);
    expect(issue.description).toContain('"Person"');
    expect(issue.data.elements.length).toEqual(2);
  });

  it('should return repeated names error: 1 class and 1 attribute named "Person"', () => {
    const person = OntoumlFactory.createKind('Person');
    OntoumlFactory.addAttribute(person, 'Person');
    const ontology = OntoumlFactory.createPackage('My Ontology', [person]);

    const issue = getIssues(ontology)[0];

    expect(issue.code).toEqual(IssueType.DUPLICATE_NAMES.code);
    expect(issue.description).toContain('"Person"');
    expect(issue.data.elements.length).toEqual(2);
  });

  it('should return missing relation name error', () => {
    const person = OntoumlFactory.createKind('Person');
    const knows = OntoumlFactory.createRelation(null, RelationStereotype.MATERIAL, person, person);
    const ontology = OntoumlFactory.createPackage('My Ontology', [person, knows]);

    const issue = getIssues(ontology)[0];

    expect(issue.code).toEqual(IssueType.MISSING_RELATION_NAME.code);
    expect(issue.data.element.id === knows.id);
  });

  it('should return missing inverse relation name error', () => {
    const person = OntoumlFactory.createKind('Person');
    const knows = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, person, person);
    const ontology = OntoumlFactory.createPackage('My Ontology', [person, knows]);

    const issue = getIssues(ontology, { createInverses: true })[0];

    expect(issue.code).toEqual(IssueType.MISSING_INVERSE_RELATION_NAME.code);
    expect(issue.data.element.id === knows.id);
  });

  it('should return missing source cardinality error', () => {
    const person = OntoumlFactory.createKind('Person');
    const knows = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, person, person);
    knows.properties[0].cardinality = null;
    const ontology = OntoumlFactory.createPackage('My Ontology', [person, knows]);

    const issue = getIssues(ontology)[0];

    expect(issue.code).toEqual(IssueType.MISSING_SOURCE_CARDINALITY.code);
    expect(issue.data.element.name === 'knows');
  });

  it('should return missing target cardinality error', () => {
    const person = OntoumlFactory.createKind('Person');
    const knows = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, person, person);
    knows.properties[1].cardinality = null;
    const ontology = OntoumlFactory.createPackage('My Ontology', [person, knows]);

    const issue = getIssues(ontology)[0];

    expect(issue.code).toEqual(IssueType.MISSING_TARGET_CARDINALITY.code);
    expect(issue.data.element.name === 'knows');
  });

  it('should return inexistent attribute type error', () => {
    const person = OntoumlFactory.createKind('Person');
    OntoumlFactory.addAttribute(person, 'name');
    const ontology = OntoumlFactory.createPackage('My Ontology', [person]);

    const issue = getIssues(ontology)[0];

    expect(issue.code).toEqual(IssueType.MISSING_ATTRIBUTE_TYPE.code);
    expect(issue.data.attribute.name).toEqual('name');
  });
});
