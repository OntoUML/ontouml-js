/**
 * Adversarial probe suite for the fluent builders: each test asserts the
 * behavior a caller would reasonably expect from the documented API. A
 * failing test flags a candidate bug, not a regression.
 */
import { Class, Project } from '../../src';

describe('Builders are single-use', () => {
  it('a second build() call throws and leaves the project untouched', () => {
    const project = new Project();
    const builder = project.classBuilder().kind().name('A');

    builder.build();

    expect(() => builder.build()).toThrow(/already been used/);
    expect(project.classes).toHaveLength(1);
  });

  it('a second build() on a relation builder throws before registering ends', () => {
    const project = new Project();
    const a = project.classBuilder().kind().build();
    const b = project.classBuilder().kind().build();
    const builder = project
      .binaryRelationBuilder()
      .source(a)
      .target(b)
      .material();

    builder.build();

    expect(() => builder.build()).toThrow(/already been used/);
    expect(project.relations).toHaveLength(1);
    expect(project.relationEnds).toHaveLength(2);
  });
});

describe('Builder clone()', () => {
  it('a cloned builder builds an independent element with a fresh id', () => {
    const project = new Project();
    const builder = project.classBuilder().kind().name('Person');

    const clone = builder.clone();
    const first = builder.build();
    const second = clone.name('Human').build();

    expect(second.id).not.toBe(first.id);
    expect(project.classes).toHaveLength(2);

    // configuration was copied, not shared
    expect(first.name.get()).toBe('Person');
    expect(second.name.get()).toBe('Human');
    expect(first.stereotype).toBe(second.stereotype);
    expect(first.restrictedTo).toEqual(second.restrictedTo);
  });

  it('cloning an already-used builder yields a buildable builder', () => {
    const project = new Project();
    const builder = project.classBuilder().kind().name('Person');
    builder.build();

    const again = builder.clone().build();

    expect(project.classes).toHaveLength(2);
    expect(again.name.get()).toBe('Person');
  });

  it('a clone does not carry over an explicitly set id', () => {
    const project = new Project();
    const builder = project.classBuilder().kind().id('person-id');

    const first = builder.build();
    const second = builder.clone().build();

    expect(first.id).toBe('person-id');
    expect(second.id).not.toBe('person-id');
  });

  it('mutating elements built from a clone does not affect the original', () => {
    const project = new Project();
    const builder = project.classBuilder().kind().name('A');

    const first = builder.build();
    const second = builder.clone().build();

    second.name.add('B');
    expect(first.name.get()).toBe('A');
  });

  it('clones share model element references (e.g., relation members)', () => {
    const project = new Project();
    const a = project.classBuilder().kind().build();
    const b = project.classBuilder().kind().build();
    const builder = project
      .binaryRelationBuilder()
      .source(a)
      .target(b)
      .material();

    const r1 = builder.build();
    const r2 = builder.clone().build();

    expect(r1.source).toBe(a);
    expect(r2.source).toBe(a);
    expect(r2.target).toBe(b);
    expect(project.relations).toHaveLength(2);
  });

  it('property builder clones keep independent cardinalities', () => {
    const project = new Project();
    const date = project.classBuilder().datatype().build();
    const person = project.classBuilder().kind().build();

    const builder = person.propertyBuilder().type(date).cardinality('1..2');
    const p1 = builder.build();
    const p2 = builder.clone().build();

    p2.cardinality.setUpperBound(5);
    expect(p1.cardinality.value).toBe('1..2');
    expect(p2.cardinality.value).toBe('1..5');
  });
});

describe('Same-project validation', () => {
  let projectA: Project;
  let projectB: Project;
  let classA: Class;
  let classB: Class;

  beforeEach(() => {
    projectA = new Project();
    projectB = new Project();
    classA = projectA.classBuilder().kind().name('A').build();
    classB = projectB.classBuilder().kind().name('B').build();
  });

  it('generalization builder rejects cross-project classifiers (control)', () => {
    expect(() =>
      projectA.generalizationBuilder().general(classA).specific(classB).build()
    ).toThrow();
  });

  it('binary relation builder rejects cross-project members', () => {
    expect(() =>
      projectA.binaryRelationBuilder().source(classA).target(classB).build()
    ).toThrow();
  });

  it('n-ary relation builder rejects cross-project members', () => {
    const classA2 = projectA.classBuilder().kind().build();
    expect(() =>
      projectA.naryRelationBuilder().members(classA, classA2, classB).build()
    ).toThrow();
  });

  it('property builder rejects a cross-project type', () => {
    expect(() => classA.propertyBuilder().type(classB).build()).toThrow();
  });

  it('anchor builder rejects a cross-project annotated element', () => {
    const note = projectA.noteBuilder().build();
    expect(() =>
      projectA.anchorBuilder().note(note).annotates(classB).build()
    ).toThrow();
  });

  it('generalization set builder rejects cross-project generalizations', () => {
    const parentB = projectB.classBuilder().kind().build();
    const genB = projectB
      .generalizationBuilder()
      .general(parentB)
      .specific(classB)
      .build();

    expect(() =>
      projectA.generalizationSetBuilder().generalizations(genB).build()
    ).toThrow();
  });

  it('class builder rejects a cross-project container package', () => {
    const pkgB = projectB.packageBuilder().build();
    expect(() =>
      projectA.classBuilder().kind().container(pkgB).build()
    ).toThrow();
  });

  it('package builder rejects cross-project contents', () => {
    expect(() => projectA.packageBuilder().contents(classB).build()).toThrow();
  });
});

describe('Generalization builder validation', () => {
  it('rejects a generalization between a classifier and itself', () => {
    const project = new Project();
    const person = project.classBuilder().kind().name('Person').build();

    expect(() =>
      project.generalizationBuilder().general(person).specific(person).build()
    ).toThrow();
  });
});

describe('ClassBuilder order defaults', () => {
  it('highOrderType() raises the order to 2 when not explicitly set', () => {
    const project = new Project();
    const c = project.classBuilder().highOrderType().build();
    expect(c.order).toBe(2);
  });

  it('highOrderType() preserves an explicitly set higher order', () => {
    const project = new Project();
    const c = project.classBuilder().order(3).highOrderType().build();
    expect(c.order).toBe(3);
  });

  it('order(0) is rejected at build time (control)', () => {
    const project = new Project();
    expect(() => project.classBuilder().kind().order(0).build()).toThrow();
  });
});

describe('Cardinality validation in builders', () => {
  it('binary relation builder rejects malformed end cardinalities', () => {
    const project = new Project();
    const a = project.classBuilder().kind().build();
    const b = project.classBuilder().kind().build();

    expect(() =>
      project
        .binaryRelationBuilder()
        .source(a)
        .target(b)
        .sourceCardinality('banana')
        .build()
    ).toThrow();
  });

  it('property builder rejects malformed cardinalities', () => {
    const project = new Project();
    const c = project.classBuilder().kind().build();
    const date = project.classBuilder().datatype().build();

    expect(() =>
      c.propertyBuilder().type(date).cardinality('banana').build()
    ).toThrow();
  });
});

describe('Builder input validation (controls)', () => {
  it('blank ids are rejected', () => {
    const project = new Project();
    expect(() => project.classBuilder().id('   ')).toThrow();
  });

  it('invalid language tags in name() are rejected', () => {
    const project = new Project();
    expect(() =>
      project.classBuilder().kind().name('Person', 'not a tag!')
    ).toThrow();
  });

  it('resources require a uri or a name', () => {
    expect(() => Project.builder().publisher()).toThrow();
  });
});
