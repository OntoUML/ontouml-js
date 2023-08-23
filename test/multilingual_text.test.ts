import { describe, expect, it, beforeEach } from "@jest/globals";
import { MultilingualText } from "../src";

describe("MultilingualText Tests", () => {
  let text: MultilingualText;

  beforeEach(() => {
    text = new MultilingualText();
  });

  // TODO: check comments
  // person.addName('Person');
  // organization.name.addAll({ en: 'Organization', 'en-US': 'Private Organization', 'pt-BR': 'Organização' });
  // product.name.addAll({ 'en-US': 'Product', 'pt-BR': 'Produto' });

  it("Test null/undefined text", () => {
    expect(text.getText()).toBe(null);
  });

  it("Test string text", () => {
    text.addText("Pessoa", "pt");
    expect(text.getText("pt")).toBe("Pessoa");
  });

  it("Test get default language", () => {
    text.addText("Person");
    expect(text.getText()).toBe("Person");
  });

  it("Test get specific language if possible", () => {
    text.addText("Person", "en");
    text.addText("Pessoa", "pt");
    expect(text.getText()).toBe("Person");

    MultilingualText.languagePreference = ["pt", "en"];
    expect(text.getText()).toBe("Pessoa");
  });

  it("Test add text using invalid tag fallbacks to default language ('en')", () => {
    expect(() => text.addText("Person", "xx")).not.toThrow();
    expect(text.getText()).toBe("Person");
  });

  it("Test get text using invalid tag fallbacks to default language ('en')", () => {
    let value;
    text.addText("Person", "en");
    expect(() => (value = text.getText("xx"))).not.toThrow();
    expect(value).toBe("Person");
  });
});
