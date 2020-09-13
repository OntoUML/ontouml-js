import { ModelManager } from '@libs/model';
// import models from '@test-models/valids';
const models = require('@test-models/valids');
import Ajv from 'ajv';
import schemas from 'ontouml-schema';
import { IPackage } from '@types';

describe('Model deserializing', () => {
  Object.values(models).forEach(model => {
    const inputModel = model as IPackage;
    let modelManager: ModelManager;

    it(`Check input model against OntoUML Schema (${inputModel.id})`, () => {
      modelManager = new ModelManager(inputModel);
    });

    // it('Test serialization', () => {
    //   const json = JSON.stringify(modelManager.rootPackage, replacer);
    //   const validator = new Ajv().compile(schemas.getSchema(schemas.ONTOUML_2));
    //   const isValid = validator(JSON.parse(json));

    //   expect(isValid).toBeTruthy();
    // });
  });
});

// TODO: move replacer to serialization library
function replacer(key, value) {
  if (key.startsWith('_')) {
    return undefined;
  }

  if (this.type) {
    let contentsFields = [];

    switch (this.type) {
      case 'Package':
        contentsFields = ['contents'];
        break;
      case 'Class':
        contentsFields = ['properties', 'literals'];
        break;
      case 'Relation':
        contentsFields = ['properties'];
        break;
      case 'Literal':
        break;
      case 'Property':
        break;
      case 'Generalization':
        break;
      case 'GeneralizationSet':
        // contentsFields = ['generalizations'];
        break;
    }

    if (!contentsFields.includes(key) && key !== 'stereotypes' && Array.isArray(value)) {
      return value.map(item => (item.id && item.type ? { id: item.id, type: item.type } : value));
    } else if (!contentsFields.includes(key) && key !== 'stereotypes' && value instanceof Object) {
      return value.id && value.type ? { id: value.id, type: value.type } : value;
    }
  }

  return value;
}
