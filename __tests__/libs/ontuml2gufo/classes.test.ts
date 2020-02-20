import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import {
  genericExample1,
  mixinExample1,
  modeExample1,
  modeExample2,
  relatorExample1,
  roleExample1,
} from '@test-models/valids';
import { IPackage } from '@types';

async function transformOntoUML2GUFO(
  model: IPackage,
  format?: string,
): Promise<string> {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new OntoUML2GUFO(modelManager);

  return await service.transformOntoUML2GUFO({
    baseIRI: 'https://example.com',
    format: format || 'N-Triple',
  });
}

it('should transform OntoUML generic model to gUFO', async () => {
  const result = await transformOntoUML2GUFO(genericExample1, 'Turtle');

  expect(result).toMatchSnapshot();
});

it('should transform OntoUML <<mixin>> class', async () => {
  const result = await transformOntoUML2GUFO(mixinExample1);

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:yhVoWg6D.AAAARSb> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:yhVoWg6D.AAAARSb> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:yhVoWg6D.AAAARSb> <rdfs:label> "Seatable"');
  expect(result).toContain(
    '<:yhVoWg6D.AAAARSb> <rdfs:subClassOf> <gufo:Endurant>',
  );
  expect(result).toContain('<:yhVoWg6D.AAAARSb> <rdf:type> <gufo:Mixin>');
});

it('should transform OntoUML generalization set', async () => {
  const result = await transformOntoUML2GUFO(mixinExample1);

  expect(result).toContain('<:yhVoWg6D.AAAARSb> <owl:equivalentClass>');
  expect(result).toContain(
    '<owl:unionOf> (<:addoWg6D.AAAARS0> <:OtjoWg6D.AAAARTV>',
  );
});

it('should transform OntoUML <<mode>> class as IntrinsicMode', async () => {
  const result = await transformOntoUML2GUFO(modeExample1);

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdfs:label> "Headache" .');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdfs:subClassOf> <gufo:IntrinsicMode>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <gufo:Kind>');
});

it('should transform OntoUML <<mode>> class as ExtrinsicMode', async () => {
  const result = await transformOntoUML2GUFO(modeExample2);

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdfs:label> "Love" .');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdfs:subClassOf> <gufo:ExtrinsicMode>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <gufo:Kind>');
});

it('should transform OntoUML <<relator>> class', async () => {
  const result = await transformOntoUML2GUFO(relatorExample1);

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:SzOFmg6D.AAAAQuF> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:SzOFmg6D.AAAAQuF> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:SzOFmg6D.AAAAQuF> <rdfs:label> "Marriage"');
  expect(result).toContain(
    '<:SzOFmg6D.AAAAQuF> <rdfs:subClassOf> <gufo:Relator>',
  );
  expect(result).toContain('<:SzOFmg6D.AAAAQuF> <rdf:type> <gufo:Kind>');
});

it('should transform OntoUML <<role>> class', async () => {
  const result = await transformOntoUML2GUFO(roleExample1);

  expect(result).toMatchSnapshot();

  // it's Husband a <<role>>
  expect(result).toContain('<:z.T5mg6D.AAAAQsY> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:z.T5mg6D.AAAAQsY> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:z.T5mg6D.AAAAQsY> <rdfs:label> "Husband"');
  expect(result).toContain('<:z.T5mg6D.AAAAQsY> <rdf:type> <gufo:Role>');

  // <<role>> Husband subclass of <<subkind>> Man
  expect(result).toContain(
    '<:z.T5mg6D.AAAAQsY> <rdfs:subClassOf> <:ech5mg6D.AAAAQqj>',
  );
  expect(result).toContain('<:ech5mg6D.AAAAQqj> <rdf:type> <gufo:SubKind> ');
  expect(result).toContain('<:ech5mg6D.AAAAQqj> <rdfs:label> "Man"');

  // <<subkind>> Man is subclass of <<kind>> Person
  expect(result).toContain(
    '<:ech5mg6D.AAAAQqj> <rdfs:subClassOf> <:IsW5mg6D.AAAAQqE>',
  );
  expect(result).toContain('<:IsW5mg6D.AAAAQqE> <rdf:type> <gufo:Kind>');
  expect(result).toContain(
    '<:IsW5mg6D.AAAAQqE> <rdfs:subClassOf> <gufo:FunctionalComplex>',
  );
  expect(result).toContain('<:IsW5mg6D.AAAAQqE> <rdfs:label> "Person"');
});
