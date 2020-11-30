import { multilingualText, Project } from '@libs/ontouml';

describe('MultilingualText Tests', () => {
  describe(`Test multilingualText.${multilingualText.getText.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = model.createClass();
    const product = model.createClass();

    person.name = 'Person';
    organization.name = { en: 'Organization', 'en-US': 'Private Organization', 'pt-BR': 'Organização' };
    product.name = { 'en-US': 'Product', 'pt-BR': 'Produto' };

    it('Test null/undefined text', () => {
      expect(multilingualText.getText(agent.name)).toBe(null);
    });

    it('Test string text', () => {
      expect(multilingualText.getText(person.name)).toBe(person.name);
    });

    it('Test get default language', () => {
      expect(multilingualText.getText(organization.name)).toBe(organization.name['en']);
      expect(Object.values(product.name)).toContain(multilingualText.getText(product.name));
    });

    it('Test get specific language if possible', () => {
      expect(multilingualText.getText(organization.name, ['de-DE', 'pt-BR'])).toBe(organization.name['pt-BR']);
      expect(multilingualText.getText(organization.name, ['de-DE'])).toBe(organization.name['en']);
    });

    it('Test get text using invalid tag', () => {
      expect(() => multilingualText.getText(organization.name, ['xx'])).toThrow();
      expect(() => multilingualText.getText(organization.name, ['123'])).toThrow();
    });
  });
});
