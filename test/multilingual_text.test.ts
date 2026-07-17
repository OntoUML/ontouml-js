import { MultilingualText } from '../src';

describe('MultilingualText Tests', () => {
  let text: MultilingualText;

  beforeEach(() => {
    text = new MultilingualText();
  });

  it('addAll() saves values keyed by their language tags', () => {
    text.addAll({
      en: 'Organization',
      'en-US': 'Private Organization',
      'pt-BR': 'Organização'
    });

    expect(text.get('en')).toBe('Organization');
    expect(text.get('en-US')).toBe('Private Organization');
    expect(text.get('pt-BR')).toBe('Organização');
  });

  it('entries() returns all language-value pairs', () => {
    text.addAll({ en: 'Person', pt: 'Pessoa' });
    expect(text.entries()).toIncludeSameMembers([
      ['en', 'Person'],
      ['pt', 'Pessoa']
    ]);
  });

  it('clear() removes all values', () => {
    text.add('Person');
    text.clear();
    expect(text.get()).toBeNull();
  });

  it('toJSON() returns null when empty and a language map otherwise', () => {
    expect(text.toJSON()).toBeNull();
    text.add('Person', 'en');
    expect(text.toJSON()).toEqual({ en: 'Person' });
  });

  it('add() saves value using the language tag', () => {
    text.add('Pessoa', 'pt');
    expect(text.get('pt')).toBe('Pessoa');
  });

  it('add() overwrites value', () => {
    text.add('Person', 'en');
    text.add('Dog', 'en');
    expect(text.get('en')).toBe('Dog');
  });

  it("if no language tag is provided, add() should save value using the default language ('en')", () => {
    text.add('Person');
    expect(text.get('en')).toBe('Person');
  });

  it('get() should return value in the correct language', () => {
    text.add('Pessoa', 'pt');
    text.add('Person', 'en');
    expect(text.get('pt')).toBe('Pessoa');
  });

  it('get() should return null if no value is defined for any langauge', () => {
    expect(text.get()).toBeNull();
  });

  it("when no language tag is provided, get() should return value using the default language ('en')", () => {
    text.add('Pessoa', 'pt');
    text.add('Person', 'en');
    expect(text.get()).toBe('Person');
  });

  it("when no language tag is provided, get() should return value using the default language preference (['it','pt','en'])", () => {
    text.add('Pessoa', 'pt');
    text.add('Person', 'en');
    MultilingualText.languagePreference = ['it', 'pt', 'en'];
    expect(text.get()).toBe('Pessoa');
  });

  it('add() should break when adding invalid tag', () => {
    text.add('Person', 'en');
    expect(() => text.add('Person', 'xx')).toThrow();
  });

  it('get() should break when adding invalid tag', () => {
    text.add('Person', 'en');
    expect(() => text.get('xx')).toThrow();
  });
});
