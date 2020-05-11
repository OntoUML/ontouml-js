import { IOntoUML2GUFOOptions } from '@types';
import { getClasses } from './docs_class';
import { getRelations } from './docs_relations';
import { getAttributes } from './docs_attributes';
import defaultTheme from './docs_theme';
import { getHBSTemplate } from './docs_hbs_helpers';
import { getPrefixList } from './docs_helpers';

const N3 = require('n3');

type Prefixes = { [key: string]: string };

export async function generateDocumentation(
  result: string,
  prefixes: Prefixes,
  options: IOntoUML2GUFOOptions,
): Promise<string> {
  const { baseIRI, format, documentationProps } = options;
  const { title, theme } = documentationProps;
  const parser = new N3.Parser({ baseIRI, format, prefixes });
  const data = await parser.parse(result);
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
