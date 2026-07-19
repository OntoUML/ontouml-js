import {
  BinaryRelation,
  Class,
  Diagram,
  Generalization,
  GeneralizationSet,
  Note,
  Project
} from '../../src';

describe('Deleting elements', () => {
  let proj: Project;

  beforeEach(() => {
    proj = new Project();
  });

  describe('Class deletion', () => {
    let person: Class, student: Class, school: Class;
    let enrollment: BinaryRelation;
    let gen: Generalization;

    beforeEach(() => {
      person = proj.classBuilder().kind().name('Person').build();
      student = proj.classBuilder().role().name('Student').build();
      school = proj.classBuilder().kind().name('School').build();

      gen = student.addParent(person);

      enrollment = proj
        .binaryRelationBuilder()
        .material()
        .source(student)
        .target(school)
        .name('enrolled in')
        .build();
    });

    it('should remove the class from the project', () => {
      student.delete();

      expect(proj.classes).not.toContain(student);
      expect(proj.class(student.id)).toBeUndefined();
    });

    it('should delete the generalizations in which the class participates', () => {
      student.delete();

      expect(proj.generalizations).toBeEmpty();
      expect(person.getChildren()).toBeEmpty();
    });

    it('should delete the relations in which the class types an end', () => {
      student.delete();

      expect(proj.relations).toBeEmpty();
      expect(school.getRelations()).toBeEmpty();
    });

    it('should deregister the ends of the deleted relations', () => {
      const ends = enrollment.properties;
      student.delete();

      ends.forEach(end => expect(proj.property(end.id)).toBeUndefined());
    });

    it('should deregister the attributes of the class', () => {
      const birthdate = person.propertyBuilder().name('birthdate').build();
      person.delete();

      expect(proj.property(birthdate.id)).toBeUndefined();
    });

    it('should clear the type of attributes typed by the class', () => {
      const date = proj.classBuilder().datatype().name('Date').build();
      const birthdate = person
        .propertyBuilder()
        .name('birthdate')
        .type(date)
        .build();

      date.delete();

      expect(birthdate.propertyType).toBeUndefined();
      expect(proj.property(birthdate.id)).toBe(birthdate);
    });

    it('should clear the categorizer of generalization sets categorized by the class', () => {
      const agePhase = proj.classBuilder().type().name('AgePhase').build();
      const gs = proj
        .generalizationSetBuilder()
        .generalizations(gen)
        .categorizer(agePhase)
        .build();

      agePhase.delete();

      expect(gs.categorizer).toBeUndefined();
      expect(proj.generalizationSet(gs.id)).toBe(gs);
    });

    it('should detach the class from its package', () => {
      const pkg = proj.packageBuilder().name('Core').build();
      const employee = pkg.classBuilder().role().name('Employee').build();

      employee.delete();

      expect(pkg.classes).toBeEmpty();
      expect(employee.container).toBeUndefined();
    });

    it('should delete the anchors attached to the class, preserving the notes', () => {
      const note = proj.noteBuilder().build();
      const anchor = note.anchorBuilder().annotates(student).build();

      student.delete();

      expect(proj.anchor(anchor.id)).toBeUndefined();
      expect(proj.note(note.id)).toBe(note);
    });

    it('should be idempotent', () => {
      student.delete();
      expect(() => student.delete()).not.toThrow();
    });
  });

  describe('Relation deletion', () => {
    it('should deregister the relation and its ends', () => {
      const person = proj.classBuilder().kind().name('Person').build();
      const knows = proj
        .binaryRelationBuilder()
        .material()
        .source(person)
        .target(person)
        .build();
      const ends = knows.properties;

      knows.delete();

      expect(proj.binaryRelation(knows.id)).toBeUndefined();
      expect(person.getRelations()).toBeEmpty();
      ends.forEach(end => expect(proj.property(end.id)).toBeUndefined());
    });

    it('should remove deleted ends from subsetted and redefined property sets', () => {
      const person = proj.classBuilder().kind().name('Person').build();
      const r1 = proj
        .binaryRelationBuilder()
        .source(person)
        .target(person)
        .build();
      const r2 = proj
        .binaryRelationBuilder()
        .source(person)
        .target(person)
        .build();

      r2.sourceEnd.addSubsettedProperty(r1.sourceEnd);
      r2.targetEnd.addRedefinedProperty(r1.targetEnd);

      r1.delete();

      expect(r2.sourceEnd.getSubsettedProperties()).toBeEmpty();
      expect(r2.targetEnd.getRedefinedProperties()).toBeEmpty();
    });
  });

  describe('Property deletion', () => {
    it('should remove a deleted attribute from its class and from the project', () => {
      const person = proj.classBuilder().kind().name('Person').build();
      const birthdate = person.propertyBuilder().name('birthdate').build();

      birthdate.delete();

      expect(person.attributes).toBeEmpty();
      expect(proj.property(birthdate.id)).toBeUndefined();
      expect(birthdate.container).toBeUndefined();
    });

    it('should delete the whole relation when a relation end is deleted', () => {
      const person = proj.classBuilder().kind().name('Person').build();
      const knows = proj
        .binaryRelationBuilder()
        .source(person)
        .target(person)
        .build();

      const targetEnd = knows.targetEnd;
      knows.sourceEnd.delete();

      expect(proj.binaryRelation(knows.id)).toBeUndefined();
      expect(proj.property(targetEnd.id)).toBeUndefined();
    });
  });

  describe('Literal deletion', () => {
    it('should remove the literal from its enumeration and from the project', () => {
      const color = proj.classBuilder().enumeration().name('Color').build();
      const red = color.literalBuilder().name('red').build();
      const blue = color.literalBuilder().name('blue').build();

      red.delete();

      expect(color.literals).toIncludeSameMembers([blue]);
      expect(proj.literal(red.id)).toBeUndefined();
    });
  });

  describe('Generalization deletion', () => {
    let person: Class, child: Class, adult: Class;
    let genChild: Generalization, genAdult: Generalization;
    let gs: GeneralizationSet;

    beforeEach(() => {
      person = proj.classBuilder().kind().name('Person').build();
      child = proj.classBuilder().phase().name('Child').build();
      adult = proj.classBuilder().phase().name('Adult').build();

      genChild = child.addParent(person);
      genAdult = adult.addParent(person);

      gs = proj
        .generalizationSetBuilder()
        .partition()
        .generalizations(genChild, genAdult)
        .build();
    });

    it('should remove the generalization from the project and from its generalization sets', () => {
      genChild.delete();

      expect(proj.generalization(genChild.id)).toBeUndefined();
      expect(gs.generalizations).toIncludeSameMembers([genAdult]);
      expect(person.getChildren()).toIncludeSameMembers([adult]);
    });

    it('should preserve the classifiers it connects', () => {
      genChild.delete();

      expect(proj.class(person.id)).toBe(person);
      expect(proj.class(child.id)).toBe(child);
    });
  });

  describe('Generalization set deletion', () => {
    it('should preserve its generalizations, clearing their back-references', () => {
      const person = proj.classBuilder().kind().name('Person').build();
      const child = proj.classBuilder().phase().name('Child').build();
      const gen = child.addParent(person);
      const gs = proj.generalizationSetBuilder().generalizations(gen).build();

      gs.delete();

      expect(proj.generalizationSet(gs.id)).toBeUndefined();
      expect(proj.generalization(gen.id)).toBe(gen);
      expect(gen.generalizationSets).toBeEmpty();
    });
  });

  describe('Package deletion', () => {
    it('should recursively delete the contents of the package', () => {
      const pkg = proj.packageBuilder().name('Core').build();
      const sub = pkg.packageBuilder().name('Agents').build();
      const person = sub.classBuilder().kind().name('Person').build();
      const org = sub.classBuilder().kind().name('Organization').build();
      const employment = sub
        .binaryRelationBuilder()
        .material()
        .source(person)
        .target(org)
        .build();

      pkg.delete();

      expect(proj.package(pkg.id)).toBeUndefined();
      expect(proj.package(sub.id)).toBeUndefined();
      expect(proj.classes).toBeEmpty();
      expect(proj.relations).toBeEmpty();
      expect(proj.properties).toBeEmpty();
      expect(proj.binaryRelation(employment.id)).toBeUndefined();
    });

    it('should delete the relations connecting its classes to outside classes', () => {
      const pkg = proj.packageBuilder().name('Core').build();
      const person = pkg.classBuilder().kind().name('Person').build();
      const outside = proj.classBuilder().kind().name('School').build();
      proj
        .binaryRelationBuilder()
        .material()
        .source(person)
        .target(outside)
        .build();

      pkg.delete();

      expect(proj.relations).toBeEmpty();
      expect(outside.getRelations()).toBeEmpty();
      expect(proj.class(outside.id)).toBe(outside);
    });

    it('should clear the project root when the root package is deleted', () => {
      const root = proj.packageBuilder().name('Root').build();
      proj.root = root;

      root.delete();

      expect(proj.root).toBeUndefined();
    });
  });

  describe('Note and anchor deletion', () => {
    let person: Class;
    let note: Note;

    beforeEach(() => {
      person = proj.classBuilder().kind().name('Person').build();
      note = proj.noteBuilder().build();
    });

    it('should delete the anchors of a deleted note', () => {
      const anchor = note.anchorBuilder().annotates(person).build();

      note.delete();

      expect(proj.note(note.id)).toBeUndefined();
      expect(proj.anchor(anchor.id)).toBeUndefined();
      expect(proj.class(person.id)).toBe(person);
    });

    it('should preserve the note and the annotated element when an anchor is deleted', () => {
      const anchor = note.anchorBuilder().annotates(person).build();

      anchor.delete();

      expect(proj.anchor(anchor.id)).toBeUndefined();
      expect(proj.note(note.id)).toBe(note);
      expect(proj.class(person.id)).toBe(person);
    });
  });

  describe('Deletion of depicted elements', () => {
    let person: Class, student: Class, school: Class;
    let enrollment: BinaryRelation;
    let gen: Generalization;
    let diagram: Diagram;

    beforeEach(() => {
      person = proj.classBuilder().kind().name('Person').build();
      student = proj.classBuilder().role().name('Student').build();
      school = proj.classBuilder().kind().name('School').build();
      gen = student.addParent(person);
      enrollment = proj
        .binaryRelationBuilder()
        .material()
        .source(student)
        .target(school)
        .build();

      diagram = proj.createDiagram();
      diagram.addModelElements([person, student, school, gen, enrollment]);
    });

    it('should delete the views of a deleted class and of its connectors', () => {
      student.delete();

      expect(diagram.containsView(student)).toBeFalse();
      expect(diagram.containsView(gen)).toBeFalse();
      expect(diagram.containsView(enrollment)).toBeFalse();
      expect(diagram.containsView(person)).toBeTrue();
      expect(diagram.containsView(school)).toBeTrue();
    });

    it('should deregister the deleted views from the project', () => {
      const studentView = diagram.findView(student)!;
      const genView = diagram.findView(gen)!;

      student.delete();

      expect(proj.views).not.toContain(studentView);
      expect(proj.views).not.toContain(genView);
    });

    it('should clear the owner of diagrams owned by a deleted element', () => {
      const pkg = proj.packageBuilder().name('Core').build();
      diagram.owner = pkg;

      pkg.delete();

      expect(diagram.owner).toBeUndefined();
    });
  });

  describe('View deletion', () => {
    let person: Class, student: Class;
    let gen: Generalization;
    let gs: GeneralizationSet;
    let diagram: Diagram;

    beforeEach(() => {
      person = proj.classBuilder().kind().name('Person').build();
      student = proj.classBuilder().role().name('Student').build();
      gen = student.addParent(person);
      gs = proj.generalizationSetBuilder().generalizations(gen).build();

      diagram = proj.createDiagram();
      diagram.addModelElements([person, student, gen, gs]);
    });

    it('should cascade to attached connector views, preserving the model', () => {
      diagram.findView(student)!.delete();

      expect(diagram.containsView(student)).toBeFalse();
      expect(diagram.containsView(gen)).toBeFalse();
      expect(proj.class(student.id)).toBe(student);
      expect(proj.generalization(gen.id)).toBe(gen);
    });

    it('should remove deleted generalization views from generalization set views', () => {
      const gsView = diagram.findView(gs)! as any;
      const genView = diagram.findView(gen)!;

      genView.delete();

      expect(gsView.generalizations).not.toContain(genView);
      expect(diagram.containsView(gs)).toBeTrue();
    });
  });

  describe('Diagram deletion', () => {
    it('should deregister the diagram and its views, preserving the model', () => {
      const person = proj.classBuilder().kind().name('Person').build();
      const diagram = proj.createDiagram();
      const view = diagram.addClass(person);

      diagram.delete();

      expect(proj.diagram(diagram.id)).toBeUndefined();
      expect(proj.views).not.toContain(view);
      expect(proj.class(person.id)).toBe(person);
    });
  });
});
