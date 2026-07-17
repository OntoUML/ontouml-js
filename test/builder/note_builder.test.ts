import { Note, Package, Project } from '../../src';

describe('Note builder tests', () => {
  let proj: Project;
  let pkg: Package;

  beforeEach(() => {
    proj = new Project();
    pkg = proj.packageBuilder().build();
  });

  it('should build a note within a project', () => {
    const note = proj.noteBuilder().id('note-1').text('A remark.').build();

    expect(note).toBeInstanceOf(Note);
    expect(note.id).toEqual('note-1');
    expect(note.text.get()).toEqual('A remark.');
    expect(note.project).toBe(proj);
    expect(proj.notes).toEqual([note]);
    expect(note.container).toBeUndefined();
  });

  it('should build a note within a package', () => {
    const note = pkg.noteBuilder().text('A remark.').build();

    expect(note.container).toBe(pkg);
    expect(pkg.notes).toEqual([note]);
    expect(proj.notes).toEqual([note]);
  });

  it('should support texts in multiple languages', () => {
    const note = pkg
      .noteBuilder()
      .text('A remark.', 'en')
      .text('Uma observação.', 'pt')
      .build();

    expect(note.text.get('en')).toEqual('A remark.');
    expect(note.text.get('pt')).toEqual('Uma observação.');
  });

  it('should build notes with names and custom properties', () => {
    const note = pkg
      .noteBuilder()
      .name('My note')
      .customProperty('reviewed', true)
      .build();

    expect(note.name.get()).toEqual('My note');
    expect(note.customProperties).toEqual({ reviewed: true });
  });
});
