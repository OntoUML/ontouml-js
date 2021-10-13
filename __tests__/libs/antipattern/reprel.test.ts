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

  const med3 = model.createMediationRelation(supervision, university);
  med3.getSourceEnd().cardinality.setOneToMany();

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

describe('RepRel Test 1', () => {
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

  const repRel = new RepRelFinder(project);
  const output = repRel.run();

  it('should find the RepRel occurrence', () => {
    expect(output.result).toHaveLength(0);
  });

  it('should set «relator» Undefined in the RepRel occurrence', () => {
    const reprel: RepRelOccurrence = output.result[0];
    expect(reprel).toBeUndefined();
  });
});

describe('RepRel Test 2', () => {
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
  med1.getSourceEnd().cardinality.setUpperBoundFromNumber(1);

  const med3 = model.createMediationRelation(supervision, university);
  med3.getSourceEnd().cardinality.setOneToMany();

  const repRel = new RepRelFinder(project);
  const output = repRel.run();

  it('should find the RepRel occurrence', () => {
    expect(output.result).toHaveLength(0);
  });

  it('should set «relator» Undefined in the RepRel occurrence', () => {
    const reprel: RepRelOccurrence = output.result[0];
    expect(reprel).toBeUndefined();
  });
});
