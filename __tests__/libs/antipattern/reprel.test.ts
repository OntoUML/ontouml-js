import { RepRelFinder } from '@libs/antipattern/reprel_finder';
import { RepRelOccurrence } from '@libs/antipattern/reprel_occurrence';
import { Project } from '@libs/ontouml';

describe('RepRel positive test with two mediation relations', () => {
  const project = new Project();
  const model = project.createModel();

  const supervisor = model.createRole('Supervisor');
  const student = model.createRole('Student');
  const university = model.createKind('University'); //this generates the issue
  const supervision = model.createRelator('Supervision');

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

describe('RepRel negative test with one mediation relation', () => {
  const project = new Project();
  const model = project.createModel();

  const supervisor = model.createRole('Supervisor');
  const supervision = model.createRelator('Supervision');

  const med1 = model.createMediationRelation(supervision, supervisor);
  med1.getSourceEnd().cardinality.setOneToMany();

  const repRel = new RepRelFinder(project);
  const output = repRel.run();

  it('should find the RepRel occurrence', () => {
    expect(output.result).toHaveLength(0);
  });
});

describe('RepRel negative test with two mediation relations one of which the upper bound is 1', () => {
  const project = new Project();
  const model = project.createModel();

  // const person = model.createKind('Person');
  const supervisor = model.createRole('Supervisor');
  const university = model.createKind('University'); //this generates the issue
  const supervision = model.createRelator('Supervision');

  const med1 = model.createMediationRelation(supervision, supervisor);
  med1.getSourceEnd().cardinality.setUpperBoundFromNumber(1);

  const med3 = model.createMediationRelation(supervision, university);
  med3.getSourceEnd().cardinality.setOneToMany();

  const repRel = new RepRelFinder(project);
  const output = repRel.run();

  it('should find the RepRel occurrence', () => {
    expect(output.result).toHaveLength(0);
  });
});
