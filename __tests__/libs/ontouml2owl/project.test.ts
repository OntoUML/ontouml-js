import { Package, Project, Class } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Projects', () => {
  let result: string;

  beforeAll(() => {
    let project = new Project({ id: 'pj1' });
    project.setName('My project', 'en');
    project.setDescription('The best project ever', 'en');

    project.createModel({ id: 'pk1' });
    project.createDiagram({ id: 'dg1' });

    result = generateOwl(project);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<t:pj1> <rdf:type> <ontouml:Project>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<t:pj1> <ontouml:name> "My project"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<t:pj1> <ontouml:description> "The best project ever"@en');
  });

  it('should generate model triple', () => {
    expect(result).toContain('<t:pj1> <ontouml:model> <t:pk1>');
  });

  it('should generate diagram triple', () => {
    expect(result).toContain('<t:pj1> <ontouml:diagram> <t:dg1>');
  });
});
