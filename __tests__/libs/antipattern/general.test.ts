import { RelOverFinder } from '@libs/antipattern/relover_finder';
import { RelOverOccurrence } from '@libs/antipattern/relover_occurrence';
import { Project } from '@libs/ontouml';


describe('RelOver Variant1 Test 0', () => {
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
  med1.getTargetEnd().cardinality.setOneToMany();

  const med2 = model.createMediationRelation(supervision, student);
  med2.getTargetEnd().cardinality.setOneToOne();

  const med3 = model.createMediationRelation(supervision, university); //this generates the issue
  med3.getTargetEnd().cardinality.setOneToMany(); //this generates the issue

  const relOver = new RelOverFinder(project);
  const output = relOver.run();

  it('should find the RelOver occurrence', () => {
    expect(output.result).toHaveLength(1);
  });

  it('should set «relator» Supervision in the RelOver occurrence', () => {
    const relover: RelOverOccurrence = output.result[0]; //this means that the output is an array
    expect(relover.relator).toEqual(supervision);
  });
});

describe('RelOver Variant1 Test 1', () => {
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
  med1.getTargetEnd().cardinality.setOneToMany();

  const med2 = model.createMediationRelation(supervision, student);
  med2.getTargetEnd().cardinality.setOneToOne();

  const med3 = model.createMediationRelation(supervision, university); //this generates the issue
  med3.getTargetEnd().cardinality.setOneToMany(); //this generates the issue

  const person1 = model.createKind('Person1');
  const detective = model.createKind('Detective');
  const employee = model.createKind('Employee');
  const leaddetective = model.createKind('LeadDetective');
  const seniordetective = model.createKind('SeniorDetective');
  const juniordetective = model.createKind('JuniorDetective');
  const criminalinvestigation = model.createRelator('CriminalInvestigation');

  const gen10 = model.createGeneralization(person, detective);
  const gen20 = model.createGeneralization(detective, seniordetective);
  const gen3 = model.createGeneralization(detective, juniordetective);
  const gen4 = model.createGeneralization(detective, leaddetective); // this generates the issue
  const gen5 = model.createGeneralization(person, employee);
  const gen6 = model.createGeneralization(employee, seniordetective);
  const gen7 = model.createGeneralization(employee, juniordetective);
  const gen8 = model.createGeneralization(employee, leaddetective);

  const med10 = model.createMediationRelation(criminalinvestigation, seniordetective);
  med1.getTargetEnd().cardinality.setOneToMany();

  const med20 = model.createMediationRelation(criminalinvestigation, juniordetective);
  med2.getTargetEnd().cardinality.setOneToOne();

  const med30 = model.createMediationRelation(criminalinvestigation, leaddetective);
  med3.getTargetEnd().cardinality.setOneToOne();

  const relOver = new RelOverFinder(project);
  const output = relOver.run();

  it('should find the RelOver occurrence', () => {
    expect(output.result).toHaveLength(2); // try to change, it detects the right number!
  });

  it('should set «relator» CriminalInvestigation in the RelOver occurrence', () => {
    const relover: RelOverOccurrence = output.result[0]; //this means that the output is an array
    expect(relover.relator).toEqual(criminalinvestigation && supervision); //this works! it detects all the involved relators
  });
});

describe('RelOver Variant1 Test 2', () => {
  const project = new Project();
  const model = project.createModel();

  const person = model.createKind('Person');
  const supervisor = model.createRole('Supervisor');
  const student = model.createRole('Student');
  const university = model.createKind('University'); //this generates the issue
  const supervision = model.createRelator('Supervision');

  const gen1 = model.createGeneralization(student, person);
  const gen2 = model.createGeneralization(supervisor, person);

  const med1 = model.createMediationRelation(supervision, supervisor);
  med1.getTargetEnd().cardinality.setOneToMany();

  const med2 = model.createMediationRelation(supervision, student);
  med2.getTargetEnd().cardinality.setOneToOne();

  const med3 = model.createMediationRelation(supervision, university); //this generates the issue
  med3.getTargetEnd().cardinality.setOneToMany(); //this generates the issue

  const relOver = new RelOverFinder(project);
  const output = relOver.run();

  it('should find the RelOver occurrence', () => {
    expect(output.result).toHaveLength(0);
  });

  it('should set «relator» Supervision in the RelOver occurrence', () => {
    const relover: RelOverOccurrence = output.result[0]; //this means that the output is an array
    expect(relover).toBeUndefined();
  });
});
