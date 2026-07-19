/**
 * Adversarial probe suite: each test asserts the behavior a caller would
 * reasonably expect from the documented API. A failing test flags a
 * candidate bug, not a regression.
 */
import {
  Cardinality,
  Class,
  GeneralizationSet,
  MultilingualText,
  Project,
  parseOrder,
  serializationUtils,
  utils
} from '../src';

describe('Cardinality', () => {
  it('rejects mixed-type constructor arguments (string, number)', () => {
    // overloads only allow (string, string) or (number, number)
    expect(() => new Cardinality('1' as any, 2 as any)).toThrow();
  });

  it('rejects malformed cardinality strings', () => {
    expect(new Cardinality('1.5').isCardinalityStringValid()).toBeFalse();
    expect(new Cardinality('abc1').isCardinalityStringValid()).toBeFalse();
    expect(new Cardinality('-1..5').isCardinalityStringValid()).toBeFalse();
    expect(new Cardinality('*..1').isCardinalityStringValid()).toBeFalse();
    expect(new Cardinality('1..2..3').isCardinalityStringValid()).toBeFalse();
  });

  it('does not consider "1.5" a valid cardinality', () => {
    expect(new Cardinality('1.5').isValid()).toBeFalse();
  });

  it('isLowerBoundValid()/isUpperBoundValid() return true for valid bounds', () => {
    const c = new Cardinality('1..2');
    expect(c.isLowerBoundValid()).toBeTrue();
    expect(c.isUpperBoundValid()).toBeTrue();

    const invalid = new Cardinality('a..b');
    expect(invalid.isLowerBoundValid()).toBeFalse();
    expect(invalid.isUpperBoundValid()).toBeFalse();
  });

  it('setBounds rejects an upper bound of zero', () => {
    const c = new Cardinality();
    expect(() => c.setBounds(2, 0)).toThrow();
  });

  it('setLowerBound rejects NaN', () => {
    const c = new Cardinality();
    expect(() => c.setLowerBound(NaN)).toThrow();
    expect(c.value).toBe('0..*');
  });

  it('setUpperBound rejects NaN', () => {
    const c = new Cardinality();
    expect(() => c.setUpperBound(NaN)).toThrow();
    expect(c.value).toBe('0..*');
  });

  it('lowerBound setter works on an unset cardinality (fallback path)', () => {
    const c = new Cardinality(null as any);
    c.lowerBound = '1';
    expect(c.value).toBe('1..*');
  });

  it('upperBound setter works on an unset cardinality (fallback path)', () => {
    const c = new Cardinality(null as any);
    c.upperBound = '5';
    expect(c.value).toBe('0..5');
  });
});

describe('Class.order and parseOrder', () => {
  it('rejects NaN as an order', () => {
    const project = new Project();
    const c = project.classBuilder().kind().build();
    expect(() => (c.order = NaN)).toThrow();
  });

  it('parseOrder maps invalid orders to 1', () => {
    // doc: '"*" -> ORDERLESS, invalid numbers -> 1'; 0 and negatives are
    // invalid orders (Class.order setter rejects < 1)
    expect(parseOrder('0')).toBe(1);
    expect(parseOrder('-3')).toBe(1);
    expect(parseOrder('')).toBe(1);
  });

  it('parsing a serialized class with order "0" does not crash', () => {
    const project = new Project();
    const c = project.classBuilder().type().build();
    const raw = JSON.parse(JSON.stringify(project));
    raw.elements.find((e: any) => e.id === c.id).order = '0';
    expect(() => serializationUtils.parse(JSON.stringify(raw))).not.toThrow();
  });
});

describe('Classifier hierarchy and relations', () => {
  it("getAllRelations includes the classifier's own relations", () => {
    const project = new Project();
    const person = project.classBuilder().kind().name('Person').build();
    const car = project.classBuilder().kind().name('Car').build();
    const owns = project
      .binaryRelationBuilder()
      .source(person)
      .target(car)
      .material()
      .build();

    expect(person.getAllRelations()).toContain(owns);
  });

  it('getAllIncomingRelations includes relations targeting the classifier itself', () => {
    const project = new Project();
    const person = project.classBuilder().kind().name('Person').build();
    const car = project.classBuilder().kind().name('Car').build();
    const owns = project
      .binaryRelationBuilder()
      .source(person)
      .target(car)
      .material()
      .build();

    expect(car.getAllIncomingRelations()).toContain(owns);
  });

  it('inherited relations are also reported', () => {
    const project = new Project();
    const person = project.classBuilder().kind().name('Person').build();
    const student = project.classBuilder().role().name('Student').build();
    student.addParent(person);
    const car = project.classBuilder().kind().name('Car').build();
    const owns = project
      .binaryRelationBuilder()
      .source(person)
      .target(car)
      .material()
      .build();

    expect(student.getAllRelations()).toContain(owns);
  });
});

describe('utils.arrayFrom', () => {
  it('returns an empty array for an empty array input', () => {
    expect(utils.arrayFrom([])).toEqual([]);
  });
});

describe('Package.removeContent', () => {
  it('returns true when the element was contained', () => {
    const project = new Project();
    const pkg = project.packageBuilder().build();
    const c = pkg.classBuilder().kind().build();

    expect(pkg.removeContent(c)).toBeTrue();
    expect(pkg.contents).not.toContain(c);
  });

  it('returns false when the element was not contained', () => {
    const project = new Project();
    const pkg = project.packageBuilder().build();
    pkg.classBuilder().kind().build(); // unrelated content
    const other = project.classBuilder().kind().build();

    expect(pkg.removeContent(other)).toBeFalse();
  });
});

describe('GeneralizationSet edge cases', () => {
  it('an empty generalization set does not break unrelated queries', () => {
    const project = new Project();
    const person = project.classBuilder().kind().name('Person').build();
    const child = project.classBuilder().phase().name('Child').build();
    const gen = child.addParent(person);

    // an empty generalization set exists somewhere in the project
    const empty = new GeneralizationSet(project);
    project.add(empty);

    // querying an unrelated classifier should not throw
    expect(() => person.getGeneralizationSets()).not.toThrow();
    expect(person.getGeneralizationSets()).not.toContain(empty);
    expect(gen.generalizationSets).toEqual([]);
  });
});

describe('Project diagram management', () => {
  it('setDiagrams accepts an empty array', () => {
    const project = new Project();
    project.createDiagram();
    expect(() => project.setDiagrams([])).not.toThrow();
    expect(project.diagrams).toEqual([]);
  });

  it('setDiagrams rejects null', () => {
    const project = new Project();
    expect(() => project.setDiagrams(null as any)).toThrow();
  });

  it('removeAllDiagrams deletes the diagrams and their views', () => {
    const project = new Project();
    const person = project.classBuilder().kind().name('Person').build();
    const diagram = project.createDiagram();
    diagram.addClass(person);
    expect(project.views).toHaveLength(1);

    project.removeAllDiagrams();

    expect(project.diagrams).toEqual([]);
    expect(project.views).toEqual([]);
    expect(project.class(person.id)).toBe(person);
  });
});

describe('MultilingualText', () => {
  it('rejects an empty-string language tag', () => {
    const text = new MultilingualText();
    expect(() => text.add('hello', '')).toThrow();
  });
});

describe('Serialization round-trip', () => {
  function buildRichProject(): Project {
    const project = new Project();
    project.name.add('Rich project');

    const pkg = project.packageBuilder().name('Core').build();
    project.root = pkg;

    const person = pkg.classBuilder().kind().name('Person').build();
    const child = pkg.classBuilder().phase().name('Child').build();
    const adult = pkg.classBuilder().phase().name('Adult').build();
    const date = pkg.classBuilder().datatype().name('Date').build();

    person.propertyBuilder().name('birthdate').type(date).build();

    const genChild = project
      .generalizationBuilder()
      .general(person)
      .specific(child)
      .build();
    const genAdult = project
      .generalizationBuilder()
      .general(person)
      .specific(adult)
      .build();

    project
      .generalizationSetBuilder()
      .generalizations(genChild, genAdult)
      .partition()
      .name('Age phases')
      .build();

    const color = pkg.classBuilder().enumeration().name('Color').build();
    color.literalBuilder().name('red').build();
    color.literalBuilder().name('blue').build();

    project
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .material()
      .name('knows')
      .build();

    const note = project.noteBuilder().build();
    note.text.add('a note');
    project.anchorBuilder().note(note).annotates(person).build();

    return project;
  }

  it('serialize -> parse -> serialize is stable', () => {
    const original = buildRichProject();
    const json1 = JSON.stringify(original, null, 2);
    const reparsed = serializationUtils.parse(json1);
    const json2 = JSON.stringify(reparsed, null, 2);
    expect(JSON.parse(json2)).toEqual(JSON.parse(json1));
  });

  it('reparsed literals remain attached to their enumeration', () => {
    const original = buildRichProject();
    const reparsed = serializationUtils.parse(JSON.stringify(original));
    const color = reparsed.classes.find(c => c.name.get() === 'Color')!;
    expect(color.literals).toHaveLength(2);
    expect(reparsed.literals).toHaveLength(2);
  });

  it('reparsed attributes remain attached to their class', () => {
    const original = buildRichProject();
    const reparsed = serializationUtils.parse(JSON.stringify(original));
    const person = reparsed.classes.find(c => c.name.get() === 'Person')!;
    expect(person.attributes).toHaveLength(1);
    expect(person.attributes[0].name.get()).toBe('birthdate');
  });

  it('rejects projects with duplicated ids instead of silently dropping elements', () => {
    const project = new Project();
    const a = project.classBuilder().kind().name('A').build();
    const b = project.classBuilder().kind().name('B').build();
    const raw = JSON.parse(JSON.stringify(project));
    raw.elements.find((e: any) => e.id === b.id).id = a.id;

    expect(() => serializationUtils.parse(JSON.stringify(raw))).toThrow(
      /duplicated ids/
    );
  });
});

describe('Deletion cascades', () => {
  it('deleting a class cascades to relations typed by it', () => {
    const project = new Project();
    const person = project.classBuilder().kind().build();
    const car = project.classBuilder().kind().build();
    const owns = project
      .binaryRelationBuilder()
      .source(person)
      .target(car)
      .material()
      .build();
    const ends = owns.properties;

    car.delete();

    expect(project.binaryRelations).toEqual([]);
    ends.forEach(end => expect(project.property(end.id)).toBeUndefined());
    expect(project.class(person.id)).toBe(person);
  });

  it('deleting an attribute does not delete its owning class', () => {
    const project = new Project();
    const date = project.classBuilder().datatype().build();
    const person = project.classBuilder().kind().build();
    const birthdate = person.propertyBuilder().type(date).build();

    birthdate.delete();

    expect(project.class(person.id)).toBe(person);
    expect(person.attributes).toEqual([]);
  });
});
