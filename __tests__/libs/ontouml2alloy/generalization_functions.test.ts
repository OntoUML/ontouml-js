import { Generalization } from '@libs/ontouml';
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { normalizeName } from '@libs/ontouml2alloy/util';
import { generateAlloy, generateFact, generateWorldAttribute, generateFun, generateWorldFact } from './helpers';
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

            expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
            expect(result).toContain(generateWorldAttribute('Person','Object'));

            expect(result).toContain(generateFact('generalization',['Man in Person']));

            expect(result).toContain(generateFact('rigid',['rigidity[Man,Object,exists]']))
            expect(result).toContain(generateWorldAttribute('Man','Object'));
          });
        
          //TODO discuss again if there should be such a test/handling such a situation
          it('Between classes without stereotypes', () => {
            const parent = model.createClass('Person');
            const child = model.createClass('Man');
            model.createGeneralization(parent, child);
        
            const result = generateAlloy(model);
            console.log(result);
            //what is expected?; should it be allowed to have such a model? - NO
          });
        
          it('Between datatypes', () => {
            const parent = model.createDatatype('Color');
            const child1 = model.createDatatype('ColorInRgb');
            model.createGeneralization(parent, child1);

            let result = generateAlloy(model);

            expect(result).toContain(generateFact('generalization',['ColorInRgb in Color']));
            expect(result).toContain('sig Color in Datatype {}');
            expect(result).toContain('sig ColorInRgb in Datatype {}');
            expect(result).toContain(generateFact('additionalDatatypeFacts',['Datatype = Color+ColorInRgb']))

          });

          it('Between relations', () => {
            const _class = model.createKind('Person');
            const parent = model.createMaterialRelation(_class, _class, 'likes');
            const child = model.createMaterialRelation(_class, _class, 'loves');
            model.createGeneralization(parent, child);
        
            const result = generateAlloy(model);
            expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']));
            expect(result).toContain(generateWorldAttribute('Person','Object'));
            expect(result).toContain(generateWorldFact('Person','Object'));

            expect(result).toContain(generateFact('generalization',['loves in likes']));
          
            expect(result).toContain(generateFun('Person1', 'Person', `(w.likes).x`));
            expect(result).toContain(generateFun('Person2', 'Person', `x.(w.likes)`));
            expect(result).toContain(generateFun('Person3', 'Person', `(w.loves).x`));
            expect(result).toContain(generateFun('Person4', 'Person', `x.(w.loves)`));

          });
        

    })
    
  });
  