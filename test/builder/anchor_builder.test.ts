import { Anchor, Class, Note, Package, Project } from '../../src';

describe('Anchor builder tests', () => {
  let proj: Project;
  let pkg: Package;
  let person: Class;
  let note: Note;

  beforeEach(() => {
    proj = new Project();
    pkg = proj.packageBuilder().build();
    person = pkg.classBuilder().kind().name('Person').build();
    note = pkg.noteBuilder().text('A remark about Person.').build();
  });

  it('should build an anchor connecting a note to an element', () => {
    const anchor = proj
      .anchorBuilder()
      .note(note)
      .annotates(person)
      .id('anchor-1')
      .build();

    expect(anchor).toBeInstanceOf(Anchor);
    expect(anchor.id).toEqual('anchor-1');
    expect(anchor.note).toBe(note);
    expect(anchor.element).toBe(person);
    expect(proj.anchors).toEqual([anchor]);
  });

  it('should build an anchor within a package', () => {
    const anchor = pkg.anchorBuilder().note(note).annotates(person).build();

    expect(anchor.container).toBe(pkg);
    expect(pkg.anchors).toEqual([anchor]);
  });

  it('should be accessible from the note', () => {
    const anchor = note.anchorBuilder().annotates(person).build();

    expect(anchor.note).toBe(note);
    expect(anchor.element).toBe(person);
  });

  it('should throw if the note is missing', () => {
    expect(() => proj.anchorBuilder().annotates(person).build()).toThrow();
  });

  it('should throw if the annotated element is missing', () => {
    expect(() => proj.anchorBuilder().note(note).build()).toThrow();
  });
});
