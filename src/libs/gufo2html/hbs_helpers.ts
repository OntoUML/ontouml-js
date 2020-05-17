import Handlebars from 'handlebars';
import { IGUFO2HTMLOptions } from '@types';
import attributesPartial from './templates/attributes';
import bodyPartial from './templates/body';
import classesPartial from './templates/classes';
import generalInformationPartial from './templates/general_information';
import headContentPartial from './templates/head_content';
import headPartial from './templates/head';
import layoutPartial from './templates/layout';
import relationsPartial from './templates/relations';
import stylesPartial from './templates/styles';
import termsIndexPartial from './templates/terms_index';

// === HELPERS ===

Handlebars.registerHelper('compare', function(
  v1: any,
  operator: string,
  v2: any,
  options: any,
) {
  'use strict';
  var operators = {
    '==': v1 == v2 ? true : false,
    '===': v1 === v2 ? true : false,
    '!=': v1 != v2 ? true : false,
    '!==': v1 !== v2 ? true : false,
    '>': v1 > v2 ? true : false,
    '>=': v1 >= v2 ? true : false,
    '<': v1 < v2 ? true : false,
    '<=': v1 <= v2 ? true : false,
    '||': v1 || v2 ? true : false,
    '&&': v1 && v2 ? true : false,
  };

  if (operators.hasOwnProperty(operator)) {
    if (operators[operator]) {
      return options.fn(this);
    }

    return options.inverse(this);
  }

  return console.error(`Error: Expression "${operator}" not found`);
});

export function getHBSTemplate(options: IGUFO2HTMLOptions) {
  const { documentationProps } = options;
  const { customPartials } = documentationProps || {};
  const {
    headContent = headContentPartial,
    styles = stylesPartial,
    head = headPartial,
    body = bodyPartial,
    generalInformation = generalInformationPartial,
    termsIndex = termsIndexPartial,
    classes = classesPartial,
    relations = relationsPartial,
    attributes = attributesPartial,
  } = customPartials || {};

  const partials: PartialTemplate[] = [
    { name: 'head_content', partial: headContent },
    { name: 'styles', partial: styles },
    { name: 'head', partial: head },
    { name: 'body', partial: body },
    { name: 'general_information', partial: generalInformation },
    { name: 'terms_index', partial: termsIndex },
    { name: 'classes', partial: classes },
    { name: 'relations', partial: relations },
    { name: 'attributes', partial: attributes },
  ];

  partials.forEach(({ name, partial }: PartialTemplate) => {
    Handlebars.registerPartial(name, partial);
  });

  return Handlebars.compile(layoutPartial);
}
