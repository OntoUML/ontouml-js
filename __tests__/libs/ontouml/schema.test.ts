import {
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Property,
  serializationUtils,
  Literal,
  Relation,
  Diagram,
  ClassView,
  RelationView,
  GeneralizationView,
  GeneralizationSetView,
  PackageView,
  Rectangle,
  Text,
  Path,
  OntoumlElement
} from '@libs/ontouml';

describe('Schema tests', () => {
  describe(`Test valid serializations of '${OntoumlElement.name}' objects against JSON Schema, but parsing fails where references cannot be resolved.`, () => {
    describe(`Test valid ${ClassView.name} objects.`, () => {
      const classReference = {
        type: 'Class',
        id: 'modelElement'
      };
      const classView1 = {
        type: 'ClassView',
        id: 'classView1',
        modelElement: classReference
      };
      const classView2 = {
        type: 'ClassView',
        id: 'classView2',
        name: 'classView2',
        description: 'classView2',
        shape: {
          type: 'Rectangle',
          id: 'classView2_shape'
        },
        modelElement: classReference
      };
      const classView3 = {
        type: 'ClassView',
        id: 'classView3',
        name: {
          en: 'classView3'
        },
        description: {
          en: 'classView3'
        },
        shape: {
          type: 'Rectangle',
          id: 'classView3_shape'
        },
        modelElement: classReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['ClassView']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/ClassView'));
      it('Minimal views should be valid', () => {
        expect(serializationUtils.validate(classView1)).toBe(true);
        expect(serializationUtils.validate(classView2)).toBe(true);
        expect(serializationUtils.validate(classView3)).toBe(true);
      });
      it('Minimal views should throw an exception due to references to non-existing elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(classView1))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(classView2))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(classView3))).toThrow();
      });
    });

    describe(`Test valid ${GeneralizationSetView.name} objects`, () => {
      const gsReference = {
        type: 'GeneralizationSet',
        id: 'modelElement'
      };
      const gsView1 = {
        type: 'GeneralizationSetView',
        id: 'gsView1',
        modelElement: gsReference
      };
      const gsView2 = {
        type: 'GeneralizationSetView',
        id: 'gsView2',
        name: 'gsView2',
        description: 'gsView2',
        shape: {
          type: 'Text',
          id: 'gsView2_shape'
        },
        modelElement: gsReference
      };
      const gsView3 = {
        type: 'GeneralizationSetView',
        id: 'gsView3',
        name: {
          en: 'gsView3'
        },
        description: {
          en: 'gsView3'
        },
        shape: {
          type: 'Text',
          id: 'gsView3_shape'
        },
        modelElement: gsReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['GeneralizationSetView']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSetView'
        ));
      it('Minimal views should be valid', () => {
        expect(serializationUtils.validate(gsView1)).toBe(true);
        expect(serializationUtils.validate(gsView2)).toBe(true);
        expect(serializationUtils.validate(gsView3)).toBe(true);
      });
      it('Minimal views should throw an exception due to references to non-existing elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(gsView1))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(gsView2))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(gsView3))).toThrow();
      });
    });

    describe(`Test valid ${GeneralizationView.name} objects`, () => {
      const genReference = {
        type: 'Generalization',
        id: 'genReference'
      };
      const sourceReference = {
        type: 'ClassView',
        id: 'sourceReference'
      };
      const targetReference = {
        type: 'ClassView',
        id: 'targetReference'
      };

      const genView1 = {
        type: 'GeneralizationView',
        id: 'genView1',
        modelElement: genReference,
        source: sourceReference,
        target: targetReference
      };
      const genView2 = {
        type: 'GeneralizationView',
        id: 'genView2',
        name: 'genView2',
        description: 'genView2',
        shape: {
          type: 'Path',
          id: 'genView2_shape'
        },
        modelElement: genReference,
        source: sourceReference,
        target: targetReference
      };
      const genView3 = {
        type: 'GeneralizationView',
        id: 'genView3',
        name: {
          en: 'genView3'
        },
        description: {
          en: 'genView3'
        },
        shape: {
          type: 'Path',
          id: 'genView3_shape'
        },
        modelElement: genReference,
        source: sourceReference,
        target: targetReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['GeneralizationView']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationView'
        ));
      it('Minimal views should be valid', () => {
        expect(serializationUtils.validate(genView1)).toBe(true);
        expect(serializationUtils.validate(genView2)).toBe(true);
        expect(serializationUtils.validate(genView3)).toBe(true);
      });
      it('Minimal views should throw an exception due to references to non-existing elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(genView1))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(genView2))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(genView3))).toThrow();
      });
    });

    describe(`Test valid ${PackageView.name} objects`, () => {
      const pkgReference = {
        type: 'Package',
        id: 'pkgReference'
      };

      const pkgView1 = {
        type: 'PackageView',
        id: 'pkgView1',
        modelElement: pkgReference
      };
      const pkgView2 = {
        type: 'PackageView',
        id: 'pkgView2',
        name: 'pkgView2',
        description: 'pkgView2',
        shape: {
          type: 'Rectangle',
          id: 'pkgView2_shape'
        },
        modelElement: pkgReference
      };
      const pkgView3 = {
        type: 'PackageView',
        id: 'pkgView3',
        name: {
          en: 'pkgView3'
        },
        description: {
          en: 'pkgView3'
        },
        shape: {
          type: 'Rectangle',
          id: 'pkgView3_shape'
        },
        modelElement: pkgReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['PackageView']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/PackageView'
        ));
      it('Minimal views should be valid', () => {
        expect(serializationUtils.validate(pkgView1)).toBe(true);
        expect(serializationUtils.validate(pkgView2)).toBe(true);
        expect(serializationUtils.validate(pkgView3)).toBe(true);
      });
      it('Minimal views should throw an exception due to references to non-existing elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(pkgView1))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(pkgView2))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(pkgView3))).toThrow();
      });
    });

    describe(`Test valid ${RelationView.name} objects`, () => {
      const relReference = {
        type: 'Relation',
        id: 'genReference'
      };
      const sourceReference = {
        type: 'ClassView',
        id: 'sourceReference'
      };
      const targetReference = {
        type: 'ClassView',
        id: 'targetReference'
      };

      const relView1 = {
        type: 'RelationView',
        id: 'relView1',
        modelElement: relReference,
        source: sourceReference,
        target: targetReference
      };
      const relView2 = {
        type: 'RelationView',
        id: 'relView2',
        name: 'relView2',
        description: 'relView2',
        shape: {
          type: 'Path',
          id: 'relView2_shape'
        },
        modelElement: relReference,
        source: sourceReference,
        target: targetReference
      };
      const relView3 = {
        type: 'RelationView',
        id: 'relView3',
        name: {
          en: 'relView3'
        },
        description: {
          en: 'relView3'
        },
        shape: {
          type: 'Path',
          id: 'relView3_shape'
        },
        modelElement: relReference,
        source: sourceReference,
        target: targetReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['RelationView']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/RelationView'
        ));
      it('Minimal views should be valid', () => {
        expect(serializationUtils.validate(relView1)).toBe(true);
        expect(serializationUtils.validate(relView2)).toBe(true);
        expect(serializationUtils.validate(relView3)).toBe(true);
      });
      it('Minimal views should throw an exception due to references to non-existing elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(relView1))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(relView2))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(relView3))).toThrow();
      });
    });

    describe(`Test valid ${Path.name} objects`, () => {
      const pathShape1 = {
        type: 'Path',
        id: 'pathShape1'
      };
      const pathShape2 = {
        type: 'Path',
        id: 'pathShape2',
        name: 'pathShape2',
        description: 'pathShape2',
        points: [{ x: null, y: null }]
      };
      const pathShape3 = {
        type: 'Path',
        id: 'pathShape3',
        name: { en: 'pathShape3' },
        description: { en: 'pathShape3' },
        points: [{ x: 0, y: 0 }]
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Path']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/PathShape'));
      it('Minimal shapes should be valid', () => {
        expect(serializationUtils.validate(pathShape1)).toBe(true);
        expect(serializationUtils.validate(pathShape2)).toBe(true);
        expect(serializationUtils.validate(pathShape3)).toBe(true);
      });
      it("Minimal shapes should not throw an exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(pathShape1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(pathShape2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(pathShape3))).not.toThrow();
      });
    });

    describe(`Test valid ${Rectangle.name} objects`, () => {
      const rectangleShape1 = {
        type: 'Rectangle',
        id: 'rectangleShape1'
      };
      const rectangleShape2 = {
        type: 'Rectangle',
        id: 'rectangleShape2',
        name: 'rectangleShape2',
        description: 'rectangleShape2',
        x: null,
        y: null,
        width: null,
        height: null
      };
      const rectangleShape3 = {
        type: 'Rectangle',
        id: 'rectangleShape3',
        name: { en: 'rectangleShape3' },
        description: { en: 'rectangleShape3' },
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Rectangle']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/RectangleShape'
        ));
      it('Minimal shapes should be valid', () => {
        expect(serializationUtils.validate(rectangleShape1)).toBe(true);
        expect(serializationUtils.validate(rectangleShape2)).toBe(true);
        expect(serializationUtils.validate(rectangleShape3)).toBe(true);
      });
      it("Minimal shapes should not throw an exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(rectangleShape1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(rectangleShape2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(rectangleShape3))).not.toThrow();
      });
    });

    describe(`Test valid ${Text.name} objects`, () => {
      const textShape1 = {
        type: 'Text',
        id: 'textShape1'
      };
      const textShape2 = {
        type: 'Text',
        id: 'textShape2',
        name: 'textShape2',
        description: 'textShape2',
        x: null,
        y: null,
        width: null,
        height: null
      };
      const textShape3 = {
        type: 'Text',
        id: 'textShape3',
        name: { en: 'textShape3' },
        description: { en: 'textShape3' },
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Text']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/TextShape'));
      it('Minimal shapes should be valid', () => {
        expect(serializationUtils.validate(textShape1)).toBe(true);
        expect(serializationUtils.validate(textShape2)).toBe(true);
        expect(serializationUtils.validate(textShape3)).toBe(true);
      });
      it("Minimal shapes should not throw an exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(textShape1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(textShape2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(textShape3))).not.toThrow();
      });
    });

    describe(`Test valid ${Diagram.name} objects`, () => {
      const ownerReference = {
        type: 'Package',
        id: 'owner'
      };

      const diagram1 = {
        type: 'Diagram',
        id: 'diagram1'
      };
      const diagram2 = {
        type: 'Diagram',
        id: 'diagram2',
        name: 'diagram2',
        description: 'diagram2',
        contents: null,
        owner: null
      };
      const diagram3 = {
        type: 'Diagram',
        id: 'diagram3',
        name: { en: 'diagram3' },
        description: { en: 'diagram3' },
        contents: [],
        owner: ownerReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Diagram']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Diagram'));
      it('Minimal diagrams should be valid', () => {
        expect(serializationUtils.validate(diagram1)).toBe(true);
        expect(serializationUtils.validate(diagram2)).toBe(true);
        expect(serializationUtils.validate(diagram3)).toBe(true);
      });
      it("Minimal diagrams should not throw an exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(diagram1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(diagram2))).not.toThrow();
      });
      it('Minimal generalization sets should throw an exception due to broken references to elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(diagram3))).toThrow();
      });
    });

    describe(`Test valid ${Class.name} objects`, () => {
      const class1 = {
        type: 'Class',
        id: 'class1'
      };
      const class2 = {
        type: 'Class',
        id: 'class2',
        name: 'class2',
        description: 'class2',
        propertyAssignments: null,
        stereotype: null,
        isAbstract: null,
        isDerived: null,
        properties: null,
        literals: null,
        restrictedTo: null,
        isExtensional: null,
        isPowertype: null,
        order: null
      };
      const class3 = {
        type: 'Class',
        id: 'class3',
        name: { en: 'class3' },
        description: { en: 'class3' },
        propertyAssignments: { someTag: true },
        stereotype: 'type',
        isAbstract: true,
        isDerived: false,
        properties: [],
        literals: [],
        restrictedTo: [],
        isExtensional: true,
        isPowertype: false,
        order: '*'
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Class']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Class'));
      it('Minimal classes should be valid', () => {
        expect(serializationUtils.validate(class1)).toBe(true);
        expect(serializationUtils.validate(class2)).toBe(true);
        expect(serializationUtils.validate(class3)).toBe(true);
      });
      it("Minimal classes should not throw an exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(class1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(class2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(class3))).not.toThrow();
      });
    });

    describe(`Test valid ${GeneralizationSet.name} objects`, () => {
      const categorizerReference = {
        type: 'Class',
        id: 'categorizer'
      };

      const generalizationSet1 = {
        type: 'GeneralizationSet',
        id: 'generalizationSet1'
      };
      const generalizationSet2 = {
        type: 'GeneralizationSet',
        id: 'generalizationSet2',
        name: 'generalizationSet2',
        description: 'generalizationSet2',
        propertyAssignments: null,
        isDisjoint: null,
        isComplete: null,
        categorizer: null,
        generalizations: null
      };
      const generalizationSet3 = {
        type: 'GeneralizationSet',
        id: 'generalizationSet3',
        name: { en: 'generalizationSet3' },
        description: { en: 'generalizationSet3' },
        propertyAssignments: { someTag: true },
        isDisjoint: false,
        isComplete: true,
        categorizer: categorizerReference,
        generalizations: []
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['GeneralizationSet']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSet'
        ));
      it('Minimal generalization sets should be valid', () => {
        expect(serializationUtils.validate(generalizationSet1)).toBe(true);
        expect(serializationUtils.validate(generalizationSet2)).toBe(true);
        expect(serializationUtils.validate(generalizationSet3)).toBe(true);
      });
      it("Minimal generalization sets should not throw an exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(generalizationSet1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(generalizationSet2))).not.toThrow();
      });
      it('Minimal generalization sets should throw an exception due to broken references to elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(generalizationSet3))).toThrow();
      });
    });

    describe(`Test valid ${Generalization.name} objects`, () => {
      const generalReference = {
        type: 'Class',
        id: 'general'
      };
      const specificReference = {
        type: 'Class',
        id: 'specific'
      };

      const generalization1 = {
        type: 'Generalization',
        id: 'generalization1',
        general: generalReference,
        specific: specificReference
      };
      const generalization2 = {
        type: 'Generalization',
        id: 'generalization2',
        name: 'generalization2',
        description: 'generalization2',
        propertyAssignments: null,
        general: generalReference,
        specific: specificReference
      };
      const generalization3 = {
        type: 'Generalization',
        id: 'generalization3',
        name: { en: 'generalization3' },
        description: { en: 'generalization3' },
        propertyAssignments: { someTag: true },
        general: generalReference,
        specific: specificReference
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Generalization']).toBe(
          'https://ontouml.org/ontouml-schema/2021-02-26/Generalization'
        ));
      it('Minimal generalizations should be valid', () => {
        expect(serializationUtils.validate(generalization1)).toBe(true);
        expect(serializationUtils.validate(generalization2)).toBe(true);
        expect(serializationUtils.validate(generalization3)).toBe(true);
      });
      // it("Minimal generalizations should not throw a }n exception as they don't have broken references to elements", () => {
      // });
      it('Minimal generalizations should throw an exception due to broken references to elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(generalization1))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(generalization2))).toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(generalization3))).toThrow();
      });
    });

    describe(`Test valid ${Literal.name} objects`, () => {
      const literal1 = {
        type: 'Literal',
        id: 'literal1'
      };
      const literal2 = {
        type: 'Literal',
        id: 'literal2',
        name: 'literal2',
        description: 'literal2',
        propertyAssignments: null
      };
      const literal3 = {
        type: 'Literal',
        id: 'literal3',
        name: { en: 'literal3' },
        description: { en: 'literal3' },
        propertyAssignments: { someTag: true }
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Literal']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Literal'));
      it('Minimal literals should be valid', () => {
        expect(serializationUtils.validate(literal1)).toBe(true);
        expect(serializationUtils.validate(literal2)).toBe(true);
        expect(serializationUtils.validate(literal3)).toBe(true);
      });
      it("Minimal literals should not throw a }n exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(literal1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(literal2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(literal3))).not.toThrow();
      });
      // it('Minimal literals should throw an exception due to broken references to elements', () => {
      // });
    });

    describe(`Test valid ${Package.name} objects`, () => {
      const package1 = {
        type: 'Package',
        id: 'package1'
      };
      const package2 = {
        type: 'Package',
        id: 'package2',
        name: 'package2',
        description: 'package2',
        propertyAssignments: null,
        contents: null
      };
      const package3 = {
        type: 'Package',
        id: 'package3',
        name: { en: 'package3' },
        description: { en: 'package3' },
        propertyAssignments: { someTag: true },
        contents: []
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Package']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Package'));
      it('Minimal packages should be valid', () => {
        expect(serializationUtils.validate(package1)).toBe(true);
        expect(serializationUtils.validate(package2)).toBe(true);
        expect(serializationUtils.validate(package3)).toBe(true);
      });
      it("Minimal packages should not throw a }n exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(package1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(package2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(package3))).not.toThrow();
      });
      // it('Minimal packages should throw an exception due to broken references to elements', () => {
      // });
    });

    describe(`Test valid ${Property.name} objects`, () => {
      const propertyTypeReference = {
        type: 'Class',
        id: 'propertyType'
      };

      const property1 = {
        type: 'Property',
        id: 'property1'
      };
      const property2 = {
        type: 'Property',
        id: 'property2',
        name: 'property2',
        description: 'property2',
        propertyAssignments: null,
        stereotype: null,
        aggregationKind: null,
        cardinality: null,
        isDerived: null,
        isOrdered: null,
        isReadOnly: null,
        propertyType: null,
        redefinedProperties: null,
        subsettedProperties: null
      };
      const property3 = {
        type: 'Property',
        id: 'property3',
        name: { en: 'property3' },
        description: { en: 'property3' },
        propertyAssignments: { someTag: true },
        stereotype: 'begin',
        aggregationKind: 'SHARED',
        cardinality: '1..*',
        isDerived: false,
        isOrdered: true,
        isReadOnly: false,
        propertyType: propertyTypeReference,
        redefinedProperties: [],
        subsettedProperties: []
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Property']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Property'));
      it('Minimal properties should be valid', () => {
        expect(serializationUtils.validate(property1)).toBe(true);
        expect(serializationUtils.validate(property2)).toBe(true);
        expect(serializationUtils.validate(property3)).toBe(true);
      });
      it("Minimal properties should not throw a }n exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(property1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(property2))).not.toThrow();
      });
      it('Minimal properties should throw an exception due to broken references to elements', () => {
        expect(() => serializationUtils.parse(JSON.stringify(property3))).toThrow();
      });
    });

    describe(`Test valid ${Relation.name} objects`, () => {
      const relation1 = {
        type: 'Relation',
        id: 'relation1'
      };
      const relation2 = {
        type: 'Relation',
        id: 'relation2',
        name: 'relation2',
        description: 'relation2',
        propertyAssignments: null,
        stereotype: null,
        isAbstract: null,
        isDerived: null,
        properties: null
      };
      const relation3 = {
        type: 'Relation',
        id: 'relation3',
        name: { en: 'relation3' },
        description: { en: 'relation3' },
        propertyAssignments: { someTag: true },
        stereotype: 'material',
        isAbstract: false,
        isDerived: false,
        properties: []
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Relation']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Relation'));
      it('Minimal relations should be valid', () => {
        expect(serializationUtils.validate(relation1)).toBe(true);
        expect(serializationUtils.validate(relation2)).toBe(true);
        expect(serializationUtils.validate(relation3)).toBe(true);
      });
      it("Minimal relations should not throw a }n exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(relation1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(relation2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(relation3))).not.toThrow();
      });
      // it('Minimal relations should throw an exception due to broken references to elements', () => {
      // });
    });

    describe(`Test valid ${Project.name} objects`, () => {
      const project1 = {
        type: 'Project',
        id: 'project1'
      };
      const project2 = {
        type: 'Project',
        id: 'project2',
        name: 'project2',
        description: 'project2',
        model: null,
        diagrams: null
      };
      const project3 = {
        type: 'Project',
        id: 'project3',
        name: { en: 'project3' },
        description: { en: 'project3' },
        model: null,
        diagrams: []
      };

      it(`Should retrieve correct schema id from 'OntoumlType'`, () =>
        expect(serializationUtils.typeToSchemaId['Project']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/Project'));
      it('Minimal projects should be valid', () => {
        expect(serializationUtils.validate(project1)).toBe(true);
        expect(serializationUtils.validate(project2)).toBe(true);
        expect(serializationUtils.validate(project3)).toBe(true);
      });
      it("Minimal projects should not throw a }n exception as they don't have broken references to elements", () => {
        expect(() => serializationUtils.parse(JSON.stringify(project1))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(project2))).not.toThrow();
        expect(() => serializationUtils.parse(JSON.stringify(project3))).not.toThrow();
      });
      // it('Minimal projects should throw an exception due to broken references to elements', () => {
      // });
    });
  });
});
