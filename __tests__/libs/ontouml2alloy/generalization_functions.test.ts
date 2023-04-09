import { Generalization } from '@libs/ontouml';
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { getNameNoSpaces } from '@libs/ontouml2alloy/util';
import { generateAlloy, generateFact, generateWorldAttribute } from '__tests__/libs/ontouml2alloy/helpers';
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
            //expect(result).toContain(generateWorldAttribute('Man','Object'));

            //what is expected to happen when transforming a subkind? -> refer to class_functions.test.ts
            console.log(result)
          }); //subkind of diff things
          //create rigid fact & etc for subkind
        
        //   it('Between classes without stereotypes', () => {
        //     const model = new Package();
        //     const parent = model.createClass('Person');
        //     const child = model.createClass('Man');
        //     model.createGeneralization(parent, child);
        
        //     const owl = generateAlloy(model);
        //     expect(owl).toContain('<:Man> <rdfs:subClassOf> <:Person>');
        //   });
        
        //   it('Between relations', () => {
        //     const model = new Package();
        //     const _class = model.createKind('Person');
        //     const parent = model.createMaterialRelation(_class, _class, 'likes');
        //     const child = model.createMaterialRelation(_class, _class, 'loves');
        //     model.createGeneralization(parent, child);
        
        //     const owl = generateAlloy(model);
        //     expect(owl).toContain('<:loves> <rdfs:subPropertyOf> <:likes>');
        //   });
        
        //   it('Between relations without stereotypes', () => {
        //     const model = new Package();
        //     const _class = model.createKind('Person');
        //     const parent = model.createBinaryRelation(_class, _class, 'likes');
        //     const child = model.createBinaryRelation(_class, _class, 'loves');
        //     model.createGeneralization(parent, child);
        
        //     const owl = generateAlloy(model);
        //     expect(owl).toContain('<:loves> <rdfs:subPropertyOf> <:likes>');
        //   });



    })
    
  });
  