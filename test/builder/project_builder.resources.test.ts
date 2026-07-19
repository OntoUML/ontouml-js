/**
 * SPIKE — exhaustive tests for the resource-valued metadata methods of
 * ProjectBuilder (and the creator/contributor methods it inherits from
 * NamedElementBuilder).
 *
 * Two candidate styles are demonstrated:
 *   Style A — one explicit describe block per method, every case spelled out.
 *             Shown for theme() and representationStyle().
 *   Style B — a table-driven describe.each stamping the shared resource
 *             contract over every method, plus small explicit blocks for
 *             method-specific behavior. Shown with three table rows; the
 *             full rollout would list all ten methods.
 */
import {
  OntologyRepresentationStyle,
  Project,
  ProjectBuilder,
  Resource
} from '../../src';

/* ======================================================================== *
 * Style A — explicit per-method suites
 * ======================================================================== */

describe('ProjectBuilder.theme() [Style A: plain, accumulating]', () => {
  it('should build a theme from a uri alone, leaving the name empty', () => {
    const proj = new ProjectBuilder()
      .theme('https://example.org/lcc/S')
      .build();

    expect(proj.themes).toHaveLength(1);
    expect(proj.themes[0].uri).toEqual('https://example.org/lcc/S');
    expect(proj.themes[0].name.get()).toBeNull();
  });

  it('should build a theme from a name alone, tagged with the default language', () => {
    const proj = new ProjectBuilder().theme(undefined, 'Agriculture').build();

    expect(proj.themes[0].uri).toBeUndefined();
    expect(proj.themes[0].name.get('en')).toEqual('Agriculture');
  });

  it('should build a theme from a uri and a name', () => {
    const proj = new ProjectBuilder()
      .theme('https://example.org/lcc/S', 'Agriculture')
      .build();

    expect(proj.themes[0].uri).toEqual('https://example.org/lcc/S');
    expect(proj.themes[0].name.get('en')).toEqual('Agriculture');
  });

  it('should tag the name with the given language', () => {
    const proj = new ProjectBuilder()
      .theme('https://example.org/lcc/S', 'Agricultura', 'pt')
      .build();

    expect(proj.themes[0].name.get('pt')).toEqual('Agricultura');
  });

  it('should accumulate themes across calls', () => {
    const proj = new ProjectBuilder()
      .theme('https://example.org/lcc/S')
      .theme('https://example.org/lcc/T')
      .build();

    expect(proj.themes.map(t => t.uri)).toEqual([
      'https://example.org/lcc/S',
      'https://example.org/lcc/T'
    ]);
  });

  it('should throw when called without arguments', () => {
    expect(() => new ProjectBuilder().theme()).toThrow(
      'A resource requires at least one of `uri` and `name`.'
    );
  });

  it('should throw when uri and name are both empty strings', () => {
    expect(() => new ProjectBuilder().theme('', '')).toThrow();
  });

  it('should throw on an invalid language tag', () => {
    expect(() =>
      new ProjectBuilder().theme(
        'https://example.org/lcc/S',
        'Agriculture',
        '!'
      )
    ).toThrow('Invalid language tag');
  });
});

describe('ProjectBuilder.representationStyle() [Style A: vocabulary-backed, single-valued]', () => {
  it('should resolve a vocabulary value to its official label', () => {
    const proj = new ProjectBuilder()
      .representationStyle(OntologyRepresentationStyle.ONTOUML)
      .build();

    expect(proj.representationStyle?.uri).toEqual(
      OntologyRepresentationStyle.ONTOUML
    );
    expect(proj.representationStyle?.name.get('en')).toEqual('OntoUML Style');
  });

  it('should leave the name empty for a non-vocabulary uri', () => {
    const proj = new ProjectBuilder()
      .representationStyle('https://example.org/my-style')
      .build();

    expect(proj.representationStyle?.name.get()).toBeNull();
  });

  it('should not override an explicitly provided name', () => {
    const proj = new ProjectBuilder()
      .representationStyle(OntologyRepresentationStyle.UFO, 'Estilo UFO', 'pt')
      .build();

    expect(proj.representationStyle?.name.get('pt')).toEqual('Estilo UFO');
  });

  it('should build a style from a name alone, tagged with the default language', () => {
    const proj = new ProjectBuilder()
      .representationStyle(undefined, 'My Style')
      .build();

    expect(proj.representationStyle?.uri).toBeUndefined();
    expect(proj.representationStyle?.name.get('en')).toEqual('My Style');
  });

  it('should overwrite the style on consecutive calls', () => {
    const proj = new ProjectBuilder()
      .representationStyle(OntologyRepresentationStyle.ONTOUML)
      .representationStyle(OntologyRepresentationStyle.UFO)
      .build();

    expect(proj.representationStyle?.uri).toEqual(
      OntologyRepresentationStyle.UFO
    );
  });

  it('should throw when called without arguments', () => {
    expect(() => new ProjectBuilder().representationStyle()).toThrow(
      'A resource requires at least one of `uri` and `name`.'
    );
  });

  it('should throw on an invalid language tag', () => {
    expect(() =>
      new ProjectBuilder().representationStyle(
        'https://example.org/my-style',
        'My Style',
        '!'
      )
    ).toThrow('Invalid language tag');
  });
});

/* ======================================================================== *
 * Style B — table-driven shared contract + explicit specifics
 * ======================================================================== */

type Invoke = (
  builder: ProjectBuilder,
  uri?: string,
  name?: string,
  language?: string
) => ProjectBuilder;

type Retrieve = (project: Project) => Resource | undefined;

// One row per method: [name, how to invoke it, how to read the result back].
// The full rollout would list all ten resource-valued methods here.
const methods: [string, Invoke, Retrieve][] = [
  ['publisher', (b, u, n, l) => b.publisher(u, n, l), p => p.publisher],
  [
    'accessRight',
    (b, u, n, l) => b.accessRight(u, n, l),
    p => p.accessRights[0]
  ],
  ['creator', (b, u, n, l) => b.creator(u, n, l), p => p.creators[0]]
];

describe.each(methods)(
  'ProjectBuilder.%s() [Style B: shared resource contract]',
  (_method, invoke, retrieve) => {
    it('should build a resource from a uri alone, leaving the name empty', () => {
      const proj = invoke(
        new ProjectBuilder(),
        'https://example.org/r'
      ).build();
      const resource = retrieve(proj);

      expect(resource?.uri).toEqual('https://example.org/r');
      expect(resource?.name.get()).toBeNull();
    });

    it('should build a resource from a name alone, tagged with the default language', () => {
      const proj = invoke(new ProjectBuilder(), undefined, 'A Name').build();
      const resource = retrieve(proj);

      expect(resource?.uri).toBeUndefined();
      expect(resource?.name.get('en')).toEqual('A Name');
    });

    it('should build a resource from a uri and a name', () => {
      const proj = invoke(
        new ProjectBuilder(),
        'https://example.org/r',
        'A Name'
      ).build();
      const resource = retrieve(proj);

      expect(resource?.uri).toEqual('https://example.org/r');
      expect(resource?.name.get('en')).toEqual('A Name');
    });

    it('should tag the name with the given language', () => {
      const proj = invoke(
        new ProjectBuilder(),
        'https://example.org/r',
        'Um Nome',
        'pt'
      ).build();

      expect(retrieve(proj)?.name.get('pt')).toEqual('Um Nome');
    });

    it('should throw when called without arguments', () => {
      expect(() => invoke(new ProjectBuilder())).toThrow(
        'A resource requires at least one of `uri` and `name`.'
      );
    });

    it('should throw when uri and name are both empty strings', () => {
      expect(() => invoke(new ProjectBuilder(), '', '')).toThrow();
    });

    it('should throw on an invalid language tag', () => {
      expect(() =>
        invoke(new ProjectBuilder(), 'https://example.org/r', 'A Name', '!')
      ).toThrow('Invalid language tag');
    });
  }
);

// Method-specific behavior stays in small explicit blocks. In the full
// rollout there would be one block like this per vocabulary-backed method
// (representationStyle, context, designedForTask, ontologyType), one
// overwrite test per single-valued method (publisher, license,
// representationStyle), and one accumulation test per list-valued method.
describe('ProjectBuilder.publisher() [Style B: method-specific]', () => {
  it('should overwrite the publisher on consecutive calls', () => {
    const proj = new ProjectBuilder()
      .publisher('https://example.org/a')
      .publisher('https://example.org/b')
      .build();

    expect(proj.publisher?.uri).toEqual('https://example.org/b');
  });
});

describe('ProjectBuilder.accessRight() [Style B: method-specific]', () => {
  it('should accumulate access rights across calls', () => {
    const proj = new ProjectBuilder()
      .accessRight('https://example.org/public')
      .accessRight('https://example.org/restricted')
      .build();

    expect(proj.accessRights.map(r => r.uri)).toEqual([
      'https://example.org/public',
      'https://example.org/restricted'
    ]);
  });
});
