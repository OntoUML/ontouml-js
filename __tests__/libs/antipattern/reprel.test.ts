import { RepRelFinder } from '@libs/antipattern/reprel_finder';
import { RepRelOccurrence } from '@libs/antipattern/reprel_occurrence';
import { Project } from '@libs/ontouml';

describe('RepRel Test 0', () => {
    const project = new Project();
    const model = project.createModel();
  
    const person = model.createKind('Person');
    const supervisor = model.createRole('Supervisor');
    const student = model.createRole('Student');
    const university = model.createKind('University'); //this generates the issue
    const supervision = model.createRelator('Supervision');
  
    const gen1 = model.createGeneralization(person, student);
    const gen2 = model.createGeneralization(person, supervisor);
  
    const med1 = model.createMediationRelation(supervision, supervisor);
    med1.getSourceEnd().cardinality.setOneToMany();
  
    const med2 = model.createMediationRelation(supervision, student);
    med2.getSourceEnd().cardinality.setOneToMany();
  
    const med3 = model.createMediationRelation(supervision, university); //this generates the issue
    med3.getSourceEnd().cardinality.setOneToMany(); //this generates the issue
  
    const repRel = new RepRelFinder(project);
    const output = repRel.run();
  
    it('should find the RepRel occurrence', () => {
      expect(output.result).toHaveLength(1);
    });
  
    it('should set «relator» Supervision in the RepRel occurrence', () => {
        const reprel: RepRelOccurrence = output.result[0];
        expect(reprel.relator).toEqual(supervision);
    });
  });

// it('should not find any relator occurrence', () => {
//     const relover: RepRelOccurrence = output.result[0]; 
//     expect(relover).toBeUndefined();
// });
