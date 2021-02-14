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

  const name = element.getName();
  if (name) {
    if (typeof name === 'string') {
      transformer.addLiteralQuad(uri, 'rdfs:label', name as string);
    } else if (typeof name === 'object') {
      for (const language of Object.keys(name)) {
        if (tags.check(language)) {
          transformer.addLiteralQuad(uri, 'rdfs:label', name[language], language);
        }
      }
    }
  }

  const description = element.getDescription();
  if (description) {
    if (typeof description === 'string') {
      transformer.addLiteralQuad(uri, 'rdfs:comment', description as string);
    } else if (typeof description === 'object') {
      for (const language of Object.keys(description)) {
        if (tags.check(language)) {
          transformer.addLiteralQuad(uri, 'rdfs:comment', description[language], language);
        }
      }
    }
  }

  return true;
}

export function transformInverseAnnotations(transformer: Ontouml2Gufo, relation: Relation) {
  transformAnnotations(transformer, relation.properties[0]);
}
