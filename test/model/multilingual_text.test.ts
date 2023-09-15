import { MultilingualText } from '../../src';

describe('MultilingualText Tests', () => {
  let text: MultilingualText;

  beforeEach(() => {
    text = new MultilingualText();
  });

  // TODO: check comments
  // person.addName('Person');
  // organization.name.addAll({ en: 'Organization', 'en-US': 'Private Organization', 'pt-BR': 'Organização' });
  // product.name.addAll({ 'en-US': 'Product', 'pt-BR': 'Produto' });

  it('Test null/undefined text', () => {
    expect(text.get()).toBe(null);
  });

  it('Test string text', () => {
    text.add('Pessoa', 'pt');
    expect(text.get('pt')).toBe('Pessoa');
  });

  it('Test get default language', () => {
    text.add('Person');
    expect(text.get()).toBe('Person');
  });

  it('Test get specific language if possible', () => {
    text.add('Person', 'en');
    text.add('Pessoa', 'pt');
    expect(text.get()).toBe('Person');

    MultilingualText.languagePreference = ['pt', 'en'];
    expect(text.get()).toBe('Pessoa');
  });

  it("Test add text using invalid tag fallbacks to default language ('en')", () => {
    expect(() => text.add('Person', 'xx')).not.toThrow();
    expect(text.get()).toBe('Person');
  });

  it("Test get text using invalid tag fallbacks to default language ('en')", () => {
    let value;
    text.add('Person', 'en');
    expect(() => (value = text.get('xx'))).not.toThrow();
    expect(value).toBe('Person');
  });
});
