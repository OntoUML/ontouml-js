import { normalizeName } from '@libs/ontouml2gufo/uri_manager';

describe('Original case is kept when there are no spaces', () => {
  it('Person -> Person', () => {
    const normalized = normalizeName('Person');
    expect(normalized).toBe('Person');
  });

  it('PERSON -> PERSON', () => {
    const normalized = normalizeName('PERSON');
    expect(normalized).toBe('PERSON');
  });

  it('person -> person', () => {
    const normalized = normalizeName('person');
    expect(normalized).toBe('person');
  });

  it('PeRsoN -> PeRsoN', () => {
    const normalized = normalizeName('PeRsoN');
    expect(normalized).toBe('PeRsoN');
  });
});

describe('Normalized names only have letters, digits, and underscore', () => {
  it('Adult_Person -> Adult_Person', () => {
    const normalized = normalizeName('Adult_Person');
    expect(normalized).toBe('Adult_Person');
  });

  it('Person2 -> Person2', () => {
    const normalized = normalizeName('Person2');
    expect(normalized).toBe('Person2');
  });

  it('1Person -> 1Person', () => {
    const normalized = normalizeName('Person@');
    expect(normalized).toBe('Person');
  });

  it('Person@ -> Person', () => {
    const normalized = normalizeName('Person@');
    expect(normalized).toBe('Person');
  });

  it('Per:son -> Person', () => {
    const normalized = normalizeName('Per:son');
    expect(normalized).toBe('Person');
  });

  it('!Person -> Person', () => {
    const normalized = normalizeName('!Person');
    expect(normalized).toBe('Person');
  });

  it('Per-son -> Person', () => {
    const normalized = normalizeName('Per-son');
    expect(normalized).toBe('PerSon');
  });

  it('" Person" -> Person', () => {
    const normalized = normalizeName(' Person');
    expect(normalized).toBe('Person');
  });

  it('"Person " -> Person', () => {
    const normalized = normalizeName('Person ');
    expect(normalized).toBe('Person');
  });
});

describe('Spaces followed by a letter are capitalized', () => {
  it('"Adult person" -> AdultPerson', () => {
    const normalized = normalizeName('Adult person');
    expect(normalized).toBe('AdultPerson');
  });

  it('Adult  person -> AdultPerson', () => {
    const normalized = normalizeName('Adult person');
    expect(normalized).toBe('AdultPerson');
  });

  it('married with -> marriedWith', () => {
    const normalized = normalizeName('married with');
    expect(normalized).toBe('marriedWith');
  });

  it('Married With -> MarriedWith', () => {
    const normalized = normalizeName('Married With');
    expect(normalized).toBe('MarriedWith');
  });

  it('MARRIED WITH -> MARRIEDWITH', () => {
    const normalized = normalizeName('MARRIED WITH');
    expect(normalized).toBe('MARRIEDWITH');
  });
});
