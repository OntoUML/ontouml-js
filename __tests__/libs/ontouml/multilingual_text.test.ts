import { multilingualTextUtils, Project } from '@libs/ontouml';

describe('MultilingualText Tests', () => {
  describe(`Test multilingualText.${multilingualTextUtils.getText.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = model.createClass();
    const product = model.createClass();

    person.name = 'Person';
    organization.name = { en: 'Organization', 'en-US': 'Private Organization', 'pt-BR': 'Organização' };
    product.name = { 'en-US': 'Product', 'pt-BR': 'Produto' };

    it('Test null/undefined text', () => {
      expect(multilingualTextUtils.getText(agent.name)).toBe(null);
    });

    it('Test string text', () => {
      expect(multilingualTextUtils.getText(person.name)).toBe(person.name);
    });

    it('Test get default language', () => {
      expect(multilingualTextUtils.getText(organization.name)).toBe(organization.name['en']);
      expect(Object.values(product.name)).toContain(multilingualTextUtils.getText(product.name));
    });

    it('Test get specific language if possible', () => {
      expect(multilingualTextUtils.getText(organization.name, ['de-DE', 'pt-BR'])).toBe(organization.name['pt-BR']);
      expect(multilingualTextUtils.getText(organization.name, ['de-DE'])).toBe(organization.name['en']);
    });

    it('Test get text using invalid tag', () => {
      expect(() => multilingualTextUtils.getText(organization.name, ['xx'])).toThrow();
      expect(() => multilingualTextUtils.getText(organization.name, ['123'])).toThrow();
    });
  });
});
