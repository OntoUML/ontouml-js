import schemas from 'ontouml-schema';
import Ajv from 'ajv';
import { OntoUMLType } from '@constants/.';
import { Model } from './Model';
import { Diagram } from './Diagram';
import { Class } from './Class';
import { Relation } from './Relation';
import { Generalization } from './Generalization';
import { GeneralizationSet } from './GeneralizationSet';
import { Literal } from './Literal';
import { Property } from './Property';
import { ModelElement } from './ModelElement';

export class Project {
  type: OntoUMLType.PROJECT_TYPE;
  id: string;
  name: null | string | object = null;
  description: null | string | object = null;
  model: null | Model;
  diagrams: null | Diagram[];

  constructor(ontoumlSchemaInstance: object) {
    if (ontoumlSchemaInstance) {
      const validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
      const isValid = validator(ontoumlSchemaInstance);

      if (!isValid) {
        throw {
          message: 'Invalid model input.',
          errors: validator.errors,
        };
      }

      Object.assign(this, ontoumlSchemaInstance);
    }
  }

  getAllModelElement(match: object): ModelElement[] {
    throw new Error('Method unimplemented!');
  }

  getAllClasses(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAllRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllGeneralizations(): Generalization[] {
    throw new Error('Method unimplemented!');
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    throw new Error('Method unimplemented!');
  }

  getAllLiterals(): Literal[] {
    throw new Error('Method unimplemented!');
  }

  getAllProperties(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getAllBinaryRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllTernaryRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllDerivationRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  toJSON(): object {
    throw new Error('Method unimplemented!');
  }
}
