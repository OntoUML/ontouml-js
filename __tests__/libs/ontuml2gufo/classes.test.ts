import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import {
  genericExample1,
  mixinExample1,
  modeExample1,
  modeExample2,
  relatorExample1,
  roleExample1,
  alpinebits,
  istandard,
} from '@test-models/valids';
import { IPackage, IOntoUML2GUFOOptions } from '@types';

async function transformOntoUML2GUFO(
  model: IPackage,
  options?: {
    format?: IOntoUML2GUFOOptions['format'];
    uriFormatBy?: IOntoUML2GUFOOptions['uriFormatBy'];
  },
): Promise<string> {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new OntoUML2GUFO(modelManager);

  return await service.transformOntoUML2GUFO({
    baseIRI: 'https://example.com',
    format: 'N-Triple',
    ...options,
  });
}

it('should transform AlpineBits model to gUFO', async () => {
  const result = await transformOntoUML2GUFO(alpinebits, { format: 'Turtle' });

  expect(result).toMatchSnapshot();
});

it('should transform AlpineBits model to gUFO - N-Triple', async () => {
  const result = await transformOntoUML2GUFO(alpinebits);

  expect(result).toMatchSnapshot();
});

it('should transform iStandard model to gUFO', async () => {
  const result = await transformOntoUML2GUFO(istandard, { format: 'Turtle' });

  expect(result).toMatchSnapshot();
});

it('should transform OntoUML generic model to gUFO', async () => {
  const result = await transformOntoUML2GUFO(genericExample1, {
    format: 'Turtle',
  });

  expect(result).toMatchSnapshot();
});

it('should transform OntoUML <<mixin>> class', async () => {
  const result = await transformOntoUML2GUFO(mixinExample1, {
    uriFormatBy: 'id',
  });

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:yhVoWg6DAAAARSb> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:yhVoWg6DAAAARSb> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:yhVoWg6DAAAARSb> <rdfs:label> "Seatable"');
  expect(result).toContain(
    '<:yhVoWg6DAAAARSb> <rdfs:subClassOf> <gufo:Endurant>',
  );
  expect(result).toContain('<:yhVoWg6DAAAARSb> <rdf:type> <gufo:Mixin>');
});

it('should transform OntoUML generalization set', async () => {
  const result = await transformOntoUML2GUFO(mixinExample1);

  expect(result).toContain('<:Crate> <owl:equivalentClass>');
  expect(result).toContain('<owl:unionOf> (<:BrokenCrate> <:SolidCrate>');
});

it('should transform OntoUML <<mode>> class as IntrinsicMode', async () => {
  const result = await transformOntoUML2GUFO(modeExample1, {
    uriFormatBy: 'id',
  });

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
  const result = await transformOntoUML2GUFO(modeExample2, {
    uriFormatBy: 'id',
  });

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
  const result = await transformOntoUML2GUFO(relatorExample1, {
    uriFormatBy: 'id',
  });

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:SzOFmg6DAAAAQuF> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:SzOFmg6DAAAAQuF> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:SzOFmg6DAAAAQuF> <rdfs:label> "Marriage"');
  expect(result).toContain(
    '<:SzOFmg6DAAAAQuF> <rdfs:subClassOf> <gufo:Relator>',
  );
  expect(result).toContain('<:SzOFmg6DAAAAQuF> <rdf:type> <gufo:Kind>');
});

it('should transform OntoUML <<role>> class', async () => {
  const result = await transformOntoUML2GUFO(roleExample1, {
    uriFormatBy: 'id',
  });

  expect(result).toMatchSnapshot();

  // it's Husband a <<role>>
  expect(result).toContain('<:zT5mg6DAAAAQsY> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:zT5mg6DAAAAQsY> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:zT5mg6DAAAAQsY> <rdfs:label> "Husband"');
  expect(result).toContain('<:zT5mg6DAAAAQsY> <rdf:type> <gufo:Role>');

  // <<role>> Husband subclass of <<subkind>> Man
  expect(result).toContain(
    '<:zT5mg6DAAAAQsY> <rdfs:subClassOf> <:ech5mg6DAAAAQqj>',
  );
  expect(result).toContain('<:ech5mg6DAAAAQqj> <rdf:type> <gufo:SubKind> ');
  expect(result).toContain('<:ech5mg6DAAAAQqj> <rdfs:label> "Man"');

  // <<subkind>> Man is subclass of <<kind>> Person
  expect(result).toContain(
    '<:ech5mg6DAAAAQqj> <rdfs:subClassOf> <:IsW5mg6DAAAAQqE>',
  );
  expect(result).toContain('<:IsW5mg6DAAAAQqE> <rdf:type> <gufo:Kind>');
  expect(result).toContain(
    '<:IsW5mg6DAAAAQqE> <rdfs:subClassOf> <gufo:FunctionalComplex>',
  );
  expect(result).toContain('<:IsW5mg6DAAAAQqE> <rdfs:label> "Person"');
});
