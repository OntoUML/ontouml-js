import { ModelManager } from '@libs/model';
import { IClass, IPackage, IRelation, IProperty, IElement, IClassifier } from '@types';
import { OntoUMLType } from '@constants/.';
import { create } from 'xmlbuilder2';
import _ from 'lodash';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

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
 * Utility class to transform OntoUML models into XSD files
 *
 * @author Tiago Prince Sales
 */
export class OntoUML2XSD {
  model: IPackage;
  opts: {
    namespaces: Object;
    schemaAttributes: Object;
    imports: Object[];
    schemaAnnotations: Object;
    rootName: string;
    rootModelClass: string;
    wrapRootModelClass: string;
    prefix: string;
    customDatatypeMap: Object;
    message: Object;
  };

  constructor(model: ModelManager) {
    this.model = model.rootPackage;

    // Transformation parameters
    this.opts = {
      namespaces: {
        iwlz: 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
        io31: 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
      },
      schemaAttributes: {
        targetNamespace: 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
        elementFormDefault: 'qualified',
      },
      imports: [
        {
          namespace: 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
          schemaLocation: 'basisschema.xsd',
        },
      ],
      schemaAnnotations: {
        'xs:appinfo': {
          // 'iwlz:standaard': 'iwlz',
          // 'iwlz:bericht': 'io31',
          // 'iwlz:release': '2.1',
          // 'iwlz:BerichtXsdVersie': '1.0.1',
          // 'iwlz:BerichtXsdMinVersie': '1.0.0',
          // 'iwlz:BerichtXsdMaxVersie': '1.0.1',
          // 'iwlz:BasisschemaXsdVersie': '1.1.0',
          // 'iwlz:BasisschemaXsdMinVersie': '1.0.0',
          // 'iwlz:BasisschemaXsdMaxVersie': '1.1.0',
        },
      },
      prefix: 'io31',
      rootName: 'Root',
      rootModelClass: 'Event Plan',
      wrapRootModelClass: 'sequence',
      customDatatypeMap: {
        int: 'xs:positiveInteger',
        'time instant': 'xs:dateTime',
        'time interval': 'xs:duration',
      },
      message: [
        {
          id: 'Event Plan',
          label: 'targetLabel',
          properties: {
            name: { label: null, type: null },
            startDate: { label: 'superName', type: null },
            endDate: { label: null, type: 'xs:date' },
            organizers: { label: null, type: null },
          },
        },
        {
          id: 'Organizer',
          label: null,
          properties: {
            name: { label: null, type: null },
            abstract: { label: null, type: null },
            shortName: { label: null, type: null },
            url: { label: null, type: 'xs:anyURI' },
          },
        },
      ],
    };
  }

  transformOntoUML2XSD(): string {
    let bodyNode = undefined;
    let bodyRootName: string;
    let bodyRootType: string;

    let rootModelClassName = this.getXSDName(this.opts.rootModelClass);
    if (!this.opts.wrapRootModelClass) {
      bodyRootName = rootModelClassName;
      bodyRootType = rootModelClassName;
    } else if (this.opts.wrapRootModelClass === 'sequence') {
      bodyRootName = rootModelClassName + 'List';
      bodyRootType = rootModelClassName + 'List';

      bodyNode = {
        '@name': bodyRootType,
        'xs:sequence': {
          'xs:element': [
            {
              '@name': rootModelClassName,
              '@type': rootModelClassName,
              '@maxOccurs': 'unbounded',
            },
          ],
        },
      };
    }

    let basicStructure = {
      'xs:schema': {
        '@xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
        // '@xmlns:iwlz': 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
        // '@xmlns:io31': 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
        // '@targetNamespace': 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
        // '@elementFormDefault': 'qualified',
        // 'xs:import': {
        //   '@namespace': 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
        //   '@schemaLocation': 'basisschema.xsd',
        // },
        'xs:annotation': {
          ...this.opts.schemaAnnotations,
        },
        'xs:element': {
          '@name': 'Message',
          '@type': this.opts.rootName,
        },
        'xs:complexType': [
          {
            '@name': this.opts.rootName,
            'xs:annotation': {
              'xs:documentation':
                'Message with information about the classified Wlz care (CIZ to care office).',
            },
            'xs:sequence': {
              'xs:element': [
                {
                  '@name': 'Header',
                  '@type': `Header`,
                },
                {
                  '@name': bodyRootName,
                  '@type': bodyRootType,
                },
              ],
            },
          },
          {
            '@name': 'Header',
            'xs:annotation': {
              'xs:documentation':
                'Message with information about the classified Wlz care (CIZ to care office).',
            },
            'xs:sequence': {
              'xs:element': [
                {
                  '@name': 'BerichtCode',
                },
                {
                  '@name': 'BerichtVersie',
                },
                {
                  '@name': 'BerichtSubversie',
                },
                {
                  '@name': 'XsdVersie',
                },
              ],
            },
          },
          bodyNode,
        ],
      },
    };

    const doc = create({ version: '1.0', encoding: 'UTF-8' }, basicStructure);

    const classes = this.model.getAllContentsByType([OntoUMLType.CLASS_TYPE]) as IClass[];
    classes.forEach(_class => {
      this.transformClass(_class, doc);
    });

    // convert the XML tree to string
    const xml = doc.end({ prettyPrint: true });

    return xml;
  }

  transformClass(_class: IClass, builder: XMLBuilder) {
    if (!_class.name || !_class.stereotypes || _class.stereotypes.length !== 1) return;

    if (this.isPrimitiveDatatype(_class)) return;

    const name = this.getXSDName(_class.name);
    const classNode = builder.last().ele('xs:complexType', { name });

    this.transformDescription(_class, classNode);
    this.transformClassProperties(_class, classNode);
  }

  transformClassProperties(_class: IClass, classNode: XMLBuilder) {
    // TODO: Create function on ModelManager to get all inherited attributes, relations, and both;
    let properties = _class.properties || [];
    _class
      .getRelations()
      .forEach(relation => properties.push(this.getOpposingProperty(_class, relation)));

    _class.getAncestors().forEach(ancestor => {
      let attributes = ancestor.properties || [];
      let relationalProperties = ancestor
        .getRelations()
        .map(relation => this.getOpposingProperty(<IClass>ancestor, relation));

      properties = _.concat(properties, attributes, relationalProperties);
    });

    if (properties.length > 0) {
      let sequenceNode = classNode.ele('xs:sequence');
      properties.forEach(attribute => this.transformProperty(attribute, sequenceNode));
    }
  }

  transformProperty(property: IProperty, builder: XMLBuilder) {
    const name =
      this.getXSDName(property.name) || this.getXSDName((<IClassifier>property.propertyType).name);
    const attrNode = builder.ele('xs:element', { name });

    this.transformDescription(property, attrNode);

    const propertyType = property.propertyType;
    if (!propertyType || propertyType.type != OntoUMLType.CLASS_TYPE) return;

    const type = <IClass>propertyType;
    let stereotypes = type.stereotypes;
    if (stereotypes || stereotypes.length === 1) {
      const stereotype = stereotypes[0];
      let typeName = null;

      if (stereotype === 'datatype') typeName = this.getXSDDatatype(type.name);
      else typeName = this.getXSDName(type.name);

      if (typeName) attrNode.att('type', typeName);
    }

    if (!property.cardinality) return;

    // TODO: Create function on ModelManager to update these values
    let lower: string = '1';
    let upper: string = '1';
    try {
      let cardinality = property.cardinality;

      // 0..1, 1..*, 0..*, 10..2
      if (cardinality.includes('..')) {
        [lower, upper] = cardinality.split('..');
      } else if (cardinality === '*') {
        lower = '0';
        upper = '*';
      } else {
        lower = upper = cardinality;
      }
    } catch (e) {
      lower = '1';
      upper = '1';
    }

    if (lower !== '1') attrNode.att('minOccurs', lower);

    if (upper === '*') attrNode.att('maxOccurs', 'unbounded');
    else if (upper !== '1') attrNode.att('maxOccurs', upper);
  }

  transformDescription(element: IElement, node: XMLBuilder) {
    if (element.description)
      node
        .ele('xs:annotation')
        .ele('xs:documentation')
        .txt(element.description);
  }

  isPrimitiveDatatype(datatype: IClass): boolean {
    const stereotypes = datatype.stereotypes;
    if (!stereotypes || stereotypes.length !== 1 || stereotypes[0] !== 'datatype' || !datatype.name)
      return false;

    const name = datatype.name.toLowerCase();
    return Object.keys(primitiveDatatypeMap).includes(name);
  }

  getOpposingProperty(_class: IClass, relation: IRelation): IProperty {
    const source = relation.properties[0];
    const target = relation.properties[1];

    if (source.propertyType.id === _class.id) return target;
    else return source;
  }

  getXSDName(originalName: string): string {
    return _.upperFirst(_.camelCase(originalName));
  }

  getXSDDatatype(name: string): string {
    let key = name.toLowerCase();
    return this.opts.customDatatypeMap[key] || primitiveDatatypeMap[key] || this.getXSDName(name);
  }
}
