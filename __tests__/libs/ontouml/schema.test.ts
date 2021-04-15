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
    it(`Test valid ${ClassView.name} objects.`, () => {
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

      expect(serializationUtils.typeToSchemaId['ClassView']).toBe('https://ontouml.org/ontouml-schema/2021-02-26/ClassView');
      expect(serializationUtils.validate(classView1)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(classView1))).toThrow();
      expect(serializationUtils.validate(classView2)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(classView2))).toThrow();
      expect(serializationUtils.validate(classView3)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(classView3))).toThrow();
    });

    it(`Test valid ${GeneralizationSetView.name} objects`, () => {
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

      expect(serializationUtils.typeToSchemaId['GeneralizationSetView']).toBe(
        'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSetView'
      );
      expect(serializationUtils.validate(gsView1)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(gsView1))).toThrow();
      expect(serializationUtils.validate(gsView2)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(gsView2))).toThrow();
      expect(serializationUtils.validate(gsView3)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(gsView3))).toThrow();
    });

    it(`Test valid ${GeneralizationView.name} objects`, () => {
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

      expect(serializationUtils.typeToSchemaId['GeneralizationView']).toBe(
        'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationView'
      );
      expect(serializationUtils.validate(genView1)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(genView1))).toThrow();
      expect(serializationUtils.validate(genView2)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(genView2))).toThrow();
      expect(serializationUtils.validate(genView3)).toBe(true);
      expect(() => serializationUtils.parse(JSON.stringify(genView3))).toThrow();
    });
  });
});
