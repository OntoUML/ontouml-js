import { Generalization } from '@libs/ontouml';
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { normalizeName } from '@libs/ontouml2alloy/util';
import { generateAlloy, generateFact, generateWorldFieldForClass, generateFun, generateWorldFact } from './helpers';
import { Package, Project } from '@libs/ontouml';

describe('Generalization functions', () => {

    describe ('transformGeneralization function',() => {

        let project: Project;
        let model: Package;
 
        beforeEach(() => {
            project = new Project();
            model = project.createModel();
          });

        it('Between classes', () => {
            const parent = model.createKind('Person');
            const child = model.createSubkind('Man');
            model.createGeneralization(parent, child);
            const result = generateAlloy(model);

            expect(result).toContain(generateFact('generalization',['Man in Person']));
          });
        
          it('Between datatypes', () => {
            const parent = model.createDatatype('Color');
            const child1 = model.createDatatype('ColorInRgb');
            model.createGeneralization(parent, child1);

            let result = generateAlloy(model);

            expect(result).toContain(generateFact('generalization',['ColorInRgb in Color']));
            expect(result).toContain(generateFact('additionalDatatypeFacts',['Datatype = Color+ColorInRgb']))

          });

          it('Between relations', () => {
            const _class = model.createKind('Person');
            const parent = model.createMaterialRelation(_class, _class, 'likes');
            const child = model.createMaterialRelation(_class, _class, 'loves');
            model.createGeneralization(parent, child);
        
            const result = generateAlloy(model);

            expect(result).toContain(generateFact('generalization',['loves in likes']));
            console.log(result);
          });

    })
    
  });
  