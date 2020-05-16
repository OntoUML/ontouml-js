import { IGUFO2HTMLOptions } from '@types';
import { getClasses } from './classes';
import { getRelations } from './relations';
import { getAttributes } from './attributes';
import defaultTheme from './theme';
import { getHBSTemplate } from './hbs_helpers';
import { getPrefixList } from './helpers';

const N3 = require('n3');

type Prefixes = { [key: string]: string };

export async function generateDocumentation(
  gufoStringFile: string,
  prefixes: Prefixes,
  options: IGUFO2HTMLOptions,
): Promise<string> {
  const { baseIRI, format, documentationProps } = options;
  const { title, theme } = documentationProps;
  const parser = new N3.Parser({ baseIRI, format, prefixes });
  const data = await parser.parse(gufoStringFile);
  const model = await new N3.Store(data);

  // === GENERATE ONTOLOGY ELEMENTS ===

  const classes = getClasses(model, prefixes);
  const relations = getRelations(model, prefixes);
  const attributes = getAttributes(model, prefixes);
  const prefixList = getPrefixList(prefixes);
  const namespace = baseIRI;

  // === GENERATE TEMPLATE ===

  const template = getHBSTemplate(options);

  return await template({
    title,
    namespace,
    prefixList,
    classes,
    relations,
    attributes,
    theme: { ...defaultTheme, ...theme },
  });
}
