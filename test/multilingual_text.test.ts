import { MultilingualText } from '../src';

describe('MultilingualText Tests', () => {
  let text: MultilingualText;

  beforeEach(() => {
    text = new MultilingualText();
  });

  // TODO: check comments
  // person.addName('Person');
  // organization.name.addAll({ en: 'Organization', 'en-US': 'Private Organization', 'pt-BR': 'Organização' });
  // product.name.addAll({ 'en-US': 'Product', 'pt-BR': 'Produto' });

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
