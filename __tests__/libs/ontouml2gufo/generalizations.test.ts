import { generateGufo } from './helpers';
import OntoumlFactory from './ontouml_factory';

describe('Generalizations', () => {
  it('Between classes', () => {
    const parent = OntoumlFactory.createKind('Person');
    const child = OntoumlFactory.createSubkind('Man');
    const gen = OntoumlFactory.createGeneralization(child, parent);
    const model = OntoumlFactory.createPackage(null, [parent, child, gen]);

    const owl = generateGufo(model);
    expect(owl).toContain('<:Man> <rdfs:subClassOf> <:Person>');
  });

  it('Between classes without stereotypes', () => {
    const parent = OntoumlFactory.createClass('Person', null, null);
    const child = OntoumlFactory.createClass('Man', null, null);
    const gen = OntoumlFactory.createGeneralization(child, parent);
    const model = OntoumlFactory.createPackage(null, [parent, child, gen]);

    const owl = generateGufo(model);
    expect(owl).toContain('<:Man> <rdfs:subClassOf> <:Person>');
  });

  it('Between relations', () => {
    const class1 = OntoumlFactory.createKind('Person');
    const parentRelation = OntoumlFactory.createMaterial('likes', class1, class1);
    const childRelation = OntoumlFactory.createMaterial('loves', class1, class1);
    const gen = OntoumlFactory.createGeneralization(childRelation, parentRelation);
    const model = OntoumlFactory.createPackage(null, [class1, parentRelation, childRelation, gen]);

    const owl = generateGufo(model);
    expect(owl).toContain('<:loves> <rdfs:subPropertyOf> <:likes>');
  });

  it('Between relations without stereotypes', () => {
    const class1 = OntoumlFactory.createKind('Person');
    const parentRelation = OntoumlFactory.createRelation('likes', null, class1, class1);
    const childRelation = OntoumlFactory.createRelation('loves', null, class1, class1);
    const gen = OntoumlFactory.createGeneralization(childRelation, parentRelation);
    const model = OntoumlFactory.createPackage(null, [class1, parentRelation, childRelation, gen]);

    const owl = generateGufo(model);
    expect(owl).toContain('<:loves> <rdfs:subPropertyOf> <:likes>');
  });
});
