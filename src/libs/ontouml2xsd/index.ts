import { ModelManager } from '@libs/model';
import { IClass, IRelation, IProperty, IElement, IClassifier } from '@types';
import { OntoUMLType } from '@constants/.';

import _ from 'lodash';
import { create } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

export interface IOntoUML2XSDOptions {
  namespace?: string;
  prefix?: string;
  customDatatypeMap?: object;
  language?: string;
  imports: MessageImport[];
  message: MessageEntry[];
}

export interface MessageImport {
  prefix: string;
  namespace: string;
  schemaLocation: string;
}

export interface MessageEntry {
  id?: string;
  label?: string;
  documentation?: string;
  properties?: PropertyEntry[];
}

export interface PropertyEntry {
  id?: string;
  path?: string[];
  label?: string;
  documentation?: string;
  type?: string;
  min?: string;
  max?: string;
}

const primitiveDatatypeMap = {
  number: 'xs:decimal',
  byte: 'xs:byte',
  short: 'xs:short',
  int: 'xs:int',
  integer: 'xs:int',
  long: 'xs:long',
  float: 'xs:decimal',
  double: 'xs:decimal',
  string: 'xs:string',
  char: 'xs:string',
  bool: 'xs:boolean',
  boolean: 'xs:boolean',
};

/**
 * A class to transform OntoUML models into XML Schemas (XSD files).
 *
 * @author Tiago Prince Sales
 */
export class OntoUML2XSD {
  model: ModelManager;
  opts: IOntoUML2XSDOptions;

  constructor(model: ModelManager, opts: IOntoUML2XSDOptions) {
    this.model = model;
    this.opts = opts;
  }

  transform(): string {
    const doc = create({ version: '1.0', encoding: 'UTF-8' }, this.createBasicStructure());

    (this.opts.imports || []).forEach(i => {
      this.addImport(i, doc);
    });

    this.opts.message.forEach(e => {
      this.addEntry(e, doc);
    });

    const xml = doc.end({ prettyPrint: true });

    return xml;
  }

  createBasicStructure() {
    const baseNamespace = this.opts.namespace || 'http://example.com/example-schema';
    const basePrefix = this.opts.prefix || 'example';

    let basicStructure = {
      'xs:schema': {
        '@xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
        '@targetNamespace': baseNamespace,
        ['@xmlns:' + basePrefix]: baseNamespace,
      },
    };

    (this.opts.imports || []).forEach(
      i => (basicStructure['xs:schema']['@xmlns:' + i.prefix] = i.namespace),
    );

    return basicStructure;
  }

  addImport(i: MessageImport, builder: XMLBuilder) {
    if (!i.namespace) throw new Error('No namespace defined in import entry');
    if (!i.schemaLocation) throw new Error('No schemaLocation value defined in import entry');
    builder.last().ele('xs:import', { namespace: i.namespace, schemaLocation: i.schemaLocation });
  }

  addEntry(entry: MessageEntry, builder: XMLBuilder) {
    let typeName: String;
    let sourceClass: IClass;

    // Entry refers to an existing class in the input model
    if (entry.id) {
      let sourceElement: IElement = this.model.getElementById(entry.id);

      if (!sourceElement)
        throw new Error('The element <' + entry.id + '> does not exist in the model!');

      if (!entry.label && !sourceElement.name)
        throw new Error(
          'The element <' + entry.id + '> has no name and no label has been provided!',
        );

      if (sourceElement.type !== OntoUMLType.CLASS_TYPE)
        throw new Error('The element <' + entry.id + '> is not a class!');

      // if (this.isPrimitiveDatatype(sourceClass)) return;

      typeName = entry.label || this.getXSDName(sourceElement.name) || '';
      sourceClass = <IClass>sourceElement;
    }

    // Entry DOES NOT refer to a class in the input model
    else {
      if (!entry.label) throw new Error('Custom elements must have a label.');

      typeName = entry.label;
    }

    const typeNode = builder.last().ele('xs:complexType', { name: typeName });
    this.addDocumentation(entry.documentation, typeNode);
    this.addProperties(entry, sourceClass, typeNode);
  }

  addProperties(entry: MessageEntry, sourceClass: IClass | undefined, classNode: XMLBuilder) {
    let pEntries: PropertyEntry[] = _.cloneDeep(entry.properties) || [];

    // If a source class has been defined...
    if (sourceClass) {
      let properties: IProperty[] = this.getAllProperties(sourceClass);

      //... but no properties have been listed,
      // we add all attributes and relations to the message (including inherited ones)
      if (pEntries.length === 0) {
        pEntries = properties.map(p => ({ id: p.id }));
      }
      //... but some properties have been listed,
      // we only accept properties accesible from the source class, which include:
      // direct, inherited, and transitive
      else {
        pEntries.forEach(pEntry => {
          // property entry contains a valid path from source class
          if (pEntry.id && pEntry.path && !this.isValidPath(entry, pEntry)) {
            throw new Error(
              'Invalid property path provided for property <' +
                (pEntry.label || pEntry.id) +
                '>. Provided: ' +
                this.pathToString(pEntry.path),
            );
          }
          // property is owned by source class
          else if (
            pEntry.id &&
            !pEntry.path &&
            properties.findIndex(p => p.id === pEntry.id) === -1
          ) {
            throw new Error(
              'Property must be owned or inherited by source class <' +
                (pEntry.label || pEntry.id) +
                '>',
            );
          }
        });
      }
    }
    // If the source class has NOT been defined, only custom properties are allowed
    else {
      pEntries = pEntries.filter(entry => entry.id === undefined);
    }

    if (pEntries.length === 0) return;

    let sequenceNode = classNode.ele('xs:sequence');

    pEntries.forEach(pEntry => {
      this.addProperty(pEntry, sequenceNode);
    });
  }

  isValidPath(entry: MessageEntry, pEntry: PropertyEntry): boolean {
    if (pEntry.path === undefined) return true;

    let i = 0;
    let node: IClass = this.model.getElementById(entry.id);

    while (i < pEntry.path.length) {
      // Checks if property exists in the model
      let nextProp: IProperty = this.model.getElementById(pEntry.path[i]);
      if (!nextProp) return false;

      // Checks if property is accesible from node (owned or inherited, attribute or association end)
      let nodeProperties: IProperty[] = this.getAllProperties(node);
      if (nodeProperties.findIndex(p => p.id === nextProp.id) === -1) return false;

      node = <IClass>nextProp.propertyType;
      i++;
    }

    return true;
  }

  pathToString(path: string[]): string {
    let properties = path.map(id => this.model.getElementById(id));

    return '[' + properties.map(p => p.name).join(', ') + ']';
  }

  addProperty(pEntry: PropertyEntry, classSeqNode: XMLBuilder) {
    let property: IProperty = this.model.getElementById(pEntry.id);
    let propertyName: string;
    let typeName: string;

    // Adds a property that DOES NOT have a counter part in the input model
    if (!property) {
      if (!pEntry.label) throw new Error('Custom properties must have a label!');
      propertyName = pEntry.label;

      if (!pEntry.type)
        throw new Error('Custom property <' + pEntry.label + '> must defined a type');

      if (!pEntry.type.includes(':') && this.opts.prefix)
        typeName = this.opts.prefix + ':' + pEntry.type;
      else typeName = pEntry.type;
    }
    // Adds a property that HAS a counter part in the input model
    else {
      propertyName = pEntry.label || this.getXSDName(property.name);

      if (!propertyName)
        throw new Error('No name can be generated for property <' + pEntry.id + '>');

      if (pEntry.type) {
        typeName = pEntry.type;
      } else {
        if (!property.propertyType)
          throw new Error('No type can be identified for property <' + pEntry.id + '>');

        if (property.propertyType.type != OntoUMLType.CLASS_TYPE)
          throw new Error('The type of property <' + pEntry.id + '> must be a class');

        const type = <IClass>property.propertyType;
        let stereotypes = type.stereotypes;

        if (!stereotypes && stereotypes.length !== 1)
          throw new Error(
            'The type of property <' + pEntry.id + '> must have exactly one stereotype',
          );

        const stereotype = stereotypes[0];
        if (stereotype === 'datatype') {
          typeName = this.getXSDDatatype(type);
        } else {
          typeName = this.getXSDClassName(type);
        }
      }
    }

    let cardinality = this.getXSDCardinalities(pEntry);

    const attrNode = classSeqNode.ele('xs:element', {
      name: propertyName,
      type: typeName,
      ...cardinality,
    });
    this.addDocumentation(pEntry.documentation, attrNode);
  }

  getXSDCardinalities(pEntry: PropertyEntry): { minOccurs: string; maxOccurs: string } {
    let property: IProperty = this.model.getElementById(pEntry.id);

    if (pEntry.min !== undefined) {
      let minValue: number = parseInt(pEntry.min);
      if (isNaN(minValue) || minValue < 0)
        throw new Error(
          'The minimum cardinality of property <' + pEntry.label ||
            pEntry.id + '> must be a non-negative integer. Provided: ' + minValue,
        );
    }

    if (pEntry.max !== undefined) {
      let maxValue: number = parseInt(pEntry.max);

      if (pEntry.max !== '*' && (isNaN(maxValue) || maxValue <= 0))
        throw new Error(
          'The maximum cardinality of property <' +
            (pEntry.label || pEntry.id) +
            "> must be a positive integer (or '*' for unbounded). Provided: max = " +
            pEntry.max,
        );

      if (pEntry.min) {
        let minValue: number = parseInt(pEntry.min);
        if (maxValue < minValue)
          throw new Error(
            'The maximum cardinality of property <' +
              (pEntry.label || pEntry.id) +
              '> must be greater or equal to its minimum cardinality. Provided: min = ' +
              pEntry.min +
              ', max = ' +
              maxValue,
          );
      }
    }

    let minOccurs: string = '1';
    let maxOccurs: string = '1';

    if (pEntry.min) {
      minOccurs = pEntry.min;
    } else if (property) {
      if (pEntry.path) minOccurs = this.derivePathLowerCardinality(pEntry) || minOccurs;
      else minOccurs = this.getLowerCardinality(property) || minOccurs;
    }

    if (pEntry.max) {
      maxOccurs = pEntry.max;
    } else if (property) {
      if (pEntry.path) maxOccurs = this.derivePathUpperCardinality(pEntry) || maxOccurs;
      else maxOccurs = this.getUpperCardinality(property) || maxOccurs;
    }

    if (minOccurs === '1') {
      minOccurs = undefined;
    }

    if (maxOccurs === '*') {
      maxOccurs = 'unbounded';
    } else if (maxOccurs === '1') {
      maxOccurs = undefined;
    }

    return { minOccurs, maxOccurs };
  }

  derivePathLowerCardinality(pEntry: PropertyEntry): string {
    if (!pEntry.path || pEntry.path.length === 0) return null;

    let cardinality = 1;

    pEntry.path.forEach(propId => {
      let p: IProperty = this.model.getElementById(propId);
      cardinality = cardinality * parseInt(this.getLowerCardinality(p));
    });

    return cardinality.toString();
  }

  derivePathUpperCardinality(pEntry: PropertyEntry): string {
    if (!pEntry.path || pEntry.path.length === 0) return null;

    let cardinality = 1;

    pEntry.path.forEach(propId => {
      let p: IProperty = this.model.getElementById(propId);
      let upper = this.getUpperCardinality(p);
      cardinality = cardinality * (upper === '*' ? -1 : parseInt(upper));
    });

    if (cardinality < 0) return '*';

    return cardinality.toString();
  }

  addDocumentation(value: string | undefined | null, node: XMLBuilder) {
    if (value)
      node
        .ele('xs:annotation')
        .ele('xs:documentation')
        .txt(value);
  }

  isPrimitiveDatatype(datatype: IClass): boolean {
    const stereotypes = datatype.stereotypes;
    if (!stereotypes || stereotypes.length !== 1 || stereotypes[0] !== 'datatype' || !datatype.name)
      return false;

    const name = datatype.name.toLowerCase();
    return Object.keys(primitiveDatatypeMap).includes(name);
  }

  getXSDName(originalName: string | null | undefined): string | undefined {
    if (!originalName) return null;

    return _.upperFirst(_.camelCase(originalName));
  }

  getXSDClassName(c: IClass): string {
    const entry: MessageEntry = this.opts.message.find(entry => entry.id === c.id);
    let name = entry && entry.label ? entry.label : this.getXSDName(c.name);
    return (this.opts.prefix ? this.opts.prefix + ':' : '') + name;
  }

  getXSDDatatype(c: IClass): string {
    let key = c.name.toLowerCase();
    return (
      this.opts.customDatatypeMap[c.id] ||
      primitiveDatatypeMap[key] ||
      (this.opts.prefix ? this.opts.prefix + ':' : '') + this.getXSDName(c.name)
    );
  }

  // TODO: Move the functions below to the ModelManager
  getOpposingProperty(sourceClass: IClass, relation: IRelation): IProperty {
    const source = relation.properties[0];
    const target = relation.properties[1];

    if (source.propertyType.id === sourceClass.id) return target;
    else return source;
  }

  getDirectProperties(c: IClass): IProperty[] {
    let attributes: IProperty[] = c.properties || [];
    let relationalProperties: IProperty[] = [];

    const relations: IRelation[] = c.getRelations() || [];
    relations.forEach(r => relationalProperties.push(this.getOpposingProperty(c, r)));

    return _.concat(attributes, relationalProperties);
  }

  getAllProperties(c: IClass): IProperty[] {
    let properties: IProperty[] = this.getDirectProperties(c);

    const ancestors: IClassifier[] = c.getAncestors() || [];
    ancestors.forEach(ancestor => {
      if (ancestor.type === OntoUMLType.CLASS_TYPE)
        properties = _.concat(properties, this.getDirectProperties(<IClass>ancestor));
    });

    return properties;
  }

  getLowerCardinality(p: IProperty): string | null {
    return this.getCardinality(p, 'lower');
  }

  getUpperCardinality(p: IProperty): string | null {
    return this.getCardinality(p, 'upper');
  }

  getCardinality(p: IProperty, selection: string): string | null {
    let value: string = p.cardinality;

    let lower: string;
    let upper: string;

    try {
      if (value.includes('..')) {
        [lower, upper] = value.split('..');
      } else if (value === '*') {
        lower = '0';
        upper = '*';
      } else {
        lower = upper = value;
      }

      if (selection === 'lower') return lower;
      if (selection === 'upper') return upper;
    } catch {
      return null;
    }

    return null;
  }
}

// let bodyNode = undefined;
// let bodyRootName: string;
// let bodyRootType: string;

// let rootModelClass = this.opts.message[0].label || this.opts.message[0].name;

// let rootModelClassName = this.getXSDName(rootModelClass);
// if (!this.opts.wrapRootModelClass) {
//   bodyRootName = rootModelClassName;
//   bodyRootType = rootModelClassName;
// } else if (this.opts.wrapRootModelClass === 'sequence') {
//   bodyRootName = rootModelClassName + 'List';
//   bodyRootType = rootModelClassName + 'List';

//   bodyNode = {
//     '@name': bodyRootType,
//     'xs:sequence': {
//       'xs:element': [
//         {
//           '@name': rootModelClassName,
//           '@type': rootModelClassName,
//           '@maxOccurs': 'unbounded',
//         },
//       ],
//     },
//   };
// }

// let basicStructure = {
//   'xs:schema': {
//     '@xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
//     // '@xmlns:iwlz': 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
//     // '@xmlns:io31': 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
//     // '@targetNamespace': 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
//     // '@elementFormDefault': 'qualified',
//     // 'xs:import': {
//     //   '@namespace': 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
//     //   '@schemaLocation': 'basisschema.xsd',
//     // },
//     'xs:annotation': {
//       ...this.opts.schemaAnnotations,
//     },
//     'xs:element': {
//       '@name': 'Message',
//       '@type': this.opts.rootName,
//     },
//     'xs:complexType': [
//       {
//         '@name': this.opts.rootName,
//         'xs:annotation': {
//           'xs:documentation':
//             'Message with information about the classified Wlz care (CIZ to care office).',
//         },
//         'xs:sequence': {
//           'xs:element': [
//             {
//               '@name': 'Header',
//               '@type': `Header`,
//             },
//             {
//               '@name': bodyRootName,
//               '@type': bodyRootType,
//             },
//           ],
//         },
//       },
//       {
//         '@name': 'Header',
//         'xs:annotation': {
//           'xs:documentation':
//             'Message with information about the classified Wlz care (CIZ to care office).',
//         },
//         'xs:sequence': {
//           'xs:element': [
//             {
//               '@name': 'BerichtCode',
//             },
//             {
//               '@name': 'BerichtVersie',
//             },
//             {
//               '@name': 'BerichtSubversie',
//             },
//             {
//               '@name': 'XsdVersie',
//             },
//           ],
//         },
//       },
//       bodyNode,
//     ],
//   },
// };
