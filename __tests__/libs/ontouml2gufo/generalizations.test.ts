import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Generalizations', () => {
  it('Between classes', () => {
    const model = new Package();
    const parent = model.createKind('Person');
    const child = model.createSubkind('Man');
    model.createGeneralization(parent, child);

    const owl = generateGufo(model);
    expect(owl).toContain('<:Man> <rdfs:subClassOf> <:Person>');
  });

  it('Between classes without stereotypes', () => {
    const model = new Package();
    const parent = model.createClass('Person');
    const child = model.createClass('Man');
    model.createGeneralization(parent, child);

    const owl = generateGufo(model);
    expect(owl).toContain('<:Man> <rdfs:subClassOf> <:Person>');
  });

  it('Between relations', () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const parent = model.createMaterialRelation(_class, _class, 'likes');
    const child = model.createMaterialRelation(_class, _class, 'loves');
    model.createGeneralization(parent, child);

    const owl = generateGufo(model);
    expect(owl).toContain('<:loves> <rdfs:subPropertyOf> <:likes>');
  });

  it('Between relations without stereotypes', () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const parent = model.createBinaryRelation(_class, _class, 'likes');
    const child = model.createBinaryRelation(_class, _class, 'loves');
    model.createGeneralization(parent, child);

    const owl = generateGufo(model);
    expect(owl).toContain('<:loves> <rdfs:subPropertyOf> <:likes>');
  });
});
