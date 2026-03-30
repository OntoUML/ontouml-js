import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { Class, OntoumlElement, Package, Project, Relation } from '@libs/ontouml';
import { getNormalizedName } from '@libs/ontouml2alloy/util';
import { generateAlloy, generateFact, generateWorldFieldForClass, generateExistsConstraint } from './helpers';
import { reservedKeywords, forbiddenCharacters } from '@libs/ontouml2alloy/util';

describe('Name normalization', () => {
  let element: OntoumlElement;
  let project: Project;
  let model: Package;
  let transformer: Ontouml2Alloy;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    transformer = new Ontouml2Alloy(model);
    element = new Class();
  });

  describe('Original name is kept when there are no issues', () => {
    it('Person -> Person', () => {
      element.addName('Person');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Person');
    });

    it('PERSON -> PERSON', () => {
      element.addName('PERSON');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('PERSON');
    });

    it('person -> person', () => {
      element.addName('person');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('person');
    });

    it('PeRsoN -> PeRsoN', () => {
      element.addName('PeRsoN');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('PeRsoN');
    });

    it('preserves Latin accented letters. Café -> Café', () => {
      element.addName('Café');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Café');
    });

    it('preserves non-latin characters. Person日本 -> Person日本', () => {
      element.addName('Person日本');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Person日本');
    });

    it('preserves trailing numbers. Person42 -> Person42', () => {
      element.addName('Person42');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Person42');
    });

    it('preserves numbers in the middle. Ha1lo -> Ha1lo', () => {
      element.addName('Ha1lo');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Ha1lo');
    });
  });

  describe('Inappropriate names are normalized properly', () => {
    //normalization of reserved keywords: abstract -> abstract_<OntoumlElementType>
    reservedKeywords.forEach(keyword => {
      it(`should normalize the reserved keyword "${keyword}"`, () => {
        element.addName(keyword);
        const normalized = getNormalizedName(transformer, element);
        expect(normalized).toBe(`${keyword}_${element.type.toLowerCase()}`);
      });
    });

    forbiddenCharacters.forEach(char => {
      it(`should remove the forbidden character "${char}" from the name`, () => {
        element.addName(`Happy${char}Person`);
        const normalized = getNormalizedName(transformer, element);
        expect(normalized).toBe('HappyPerson');
      });
    });

    //normalization of empty name: '' -> Unnamed_OntoumlElementType;
    it('should normalize a class with no name', () => {
      element.addName('');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('class');
    });

    it('should normalize a relation with no name', () => {
      element = new Relation();
      element.addName('');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('relation');
    });

    it('should transform a relation between datatypes', () => {
      const sourceClass = model.createDatatype('Date');
      const targetClass = model.createDatatype('String');
      const relation = model.createBinaryRelation(sourceClass, targetClass);

      const result = generateAlloy(model);

      expect(result).toContain('sig Date in Datatype {\n        relation: String_class\n}');
    });

    it('should normalize two classes with no name/only forbidden characters', () => {
      const element1 = model.createKind('');
      const element2 = model.createKind('!!!');
      const normalized1 = getNormalizedName(transformer, element1);
      const normalized2 = getNormalizedName(transformer, element2);

      expect(normalized1).toBe('class');
      expect(normalized2).toBe('class1');
    });

    it('should normalize two classes with same name', () => {
      model.createKind('Person');
      model.createKind('Person');
      const result = generateAlloy(model);

      expect(result).toContain(generateFact('rigid', ['rigidity[Person,Object,exists]']));
      expect(result).toContain(generateFact('rigid', ['rigidity[Person1,Object,exists]']));
      expect(result).toContain(generateWorldFieldForClass('Person', 'Object'));
      expect(result).toContain(generateWorldFieldForClass('Person1', 'Object'));
      expect(result).toContain(generateExistsConstraint('Person+Person1', 'Object'));
    });

    it('should normalize a class starting with a number', () => {
      element.addName('123Person');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('class_123Person');
    });
  });

  describe('Reserved keyword matching is case-insensitive', () => {
    it('Object -> Object_class', () => {
      element.addName('Object');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Object_class');
    });

    it('ABSTRACT -> ABSTRACT_class', () => {
      element.addName('ABSTRACT');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('ABSTRACT_class');
    });

    it('Datatype -> Datatype_class', () => {
      element.addName('Datatype');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('Datatype_class');
    });

    it('preserves original casing in the output. DiSj -> DiSj_class', () => {
      element.addName('DiSj');
      const normalized = getNormalizedName(transformer, element);
      expect(normalized).toBe('DiSj_class');
    });
  });
});
