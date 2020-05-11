import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { IOntoUML2GUFOOptions } from '@types';

// === LOAD TEMPLATE LAYOUT ===

const templateStr = fs
  // tslint:disable-next-line: non-literal-fs-path
  .readFileSync(path.resolve(__dirname, 'templates/layout.hbs'))
  .toString('utf8');

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

export function getHBSTemplate(options: IOntoUML2GUFOOptions) {
  const { documentationProps } = options;
  const {
    customPartials: {
      headContent,
      styles,
      head,
      body,
      termsIndex,
      classes: customClasses,
      relations: customRelations,
      attributes: customAttributes,
    },
  } = documentationProps;

  const partials: PartialTemplate[] = [
    {
      name: 'head_content',
      filename: 'templates/head_content.hbs',
      custom: headContent,
    },
    { name: 'styles', filename: 'templates/styles.hbs', custom: styles },
    { name: 'head', filename: 'templates/head.hbs', custom: head },
    { name: 'body', filename: 'templates/body.hbs', custom: body },
    {
      name: 'terms_index',
      filename: 'templates/terms_index.hbs',
      custom: termsIndex,
    },
    {
      name: 'classes',
      filename: 'templates/classes.hbs',
      custom: customClasses,
    },
    {
      name: 'relations',
      filename: 'templates/relations.hbs',
      custom: customRelations,
    },
    {
      name: 'attributes',
      filename: 'templates/attributes.hbs',
      custom: customAttributes,
    },
  ];

  partials.forEach(({ name, filename, custom }: PartialTemplate) => {
    const partialStr = fs
      // tslint:disable-next-line: non-literal-fs-path
      .readFileSync(path.resolve(__dirname, filename))
      .toString('utf8');

    Handlebars.registerPartial(name, custom || partialStr);
  });

  return Handlebars.compile(templateStr);
}
