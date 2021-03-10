import { ModelElement, Relation } from '@libs/ontouml';
import { Ontouml2Gufo } from './';
import tags from 'language-tags';

export function transformAnnotations(transformer: Ontouml2Gufo, element: ModelElement): boolean {
  const labels = transformer.options.getCustomLabels(element) || {};
  const uri = transformer.getUri(element);

  for (const language of Object.keys(labels)) {
    if (tags.check(language)) {
      transformer.addLiteralQuad(uri, 'rdfs:label', labels[language], language);
    }
  }

  const { propertyAssignments } = element;

  if (propertyAssignments) {
    for (const language of Object.keys(propertyAssignments)) {
      if (tags.check(language)) {
        transformer.addLiteralQuad(uri, 'rdfs:label', propertyAssignments[language], language);
      }
    }
  }

  if (labels.default) {
    transformer.addLiteralQuad(uri, 'rdfs:label', labels.default);
  }

  if (element.name) {
    for (const [language, value] of element.name.entries()) {
      if (tags.check(language)) {
        transformer.addLiteralQuad(uri, 'rdfs:label', value, language);
      }
    }
  }

  if (element.description) {
    for (const [language, value] of element.description.entries()) {
      if (tags.check(language)) {
        transformer.addLiteralQuad(uri, 'rdfs:comment', value, language);
      }
    }
  }

  return true;
}

export function transformInverseAnnotations(transformer: Ontouml2Gufo, relation: Relation) {
  transformAnnotations(transformer, relation.properties[0]);
}
