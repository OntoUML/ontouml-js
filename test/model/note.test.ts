import { Anchor, Class, Note, Package, Project } from '../../src';

describe('Note and anchor tests', () => {
  let proj: Project;
  let pkg: Package;
  let person: Class;
  let note: Note;
  let anchor: Anchor;

  beforeEach(() => {
    proj = new Project();
    pkg = proj.packageBuilder().build();
    person = pkg.classBuilder().kind().name('Person').build();
    note = pkg.noteBuilder().text('A remark.').build();
    anchor = pkg.anchorBuilder().note(note).annotates(person).build();
  });

  it('notes should be contained by their packages', () => {
    expect(note.container).toBe(pkg);
    expect(pkg.getAllNotes()).toEqual([note]);
  });

  it('anchors should connect notes to model elements', () => {
    expect(anchor.note).toBe(note);
    expect(anchor.element).toBe(person);
    expect(anchor.container).toBe(pkg);
    expect(pkg.getAllAnchors()).toEqual([anchor]);
  });

  it('notes should serialize their texts as language strings', () => {
    const raw = note.toJSON();

    expect(raw.type).toEqual('Note');
    expect(raw.text).toEqual({ en: 'A remark.' });
  });

  it('anchors should serialize references to their note and element', () => {
    const raw = anchor.toJSON();

    expect(raw.type).toEqual('Anchor');
    expect(raw.note).toEqual(note.id);
    expect(raw.element).toEqual(person.id);
  });

  it('projects should index notes and anchors by id', () => {
    expect(proj.note(note.id)).toBe(note);
    expect(proj.anchor(anchor.id)).toBe(anchor);
    expect(proj.element(note.id)).toBe(note);
    expect(proj.element(anchor.id)).toBe(anchor);
  });
});
