import { RelOverFinder, RelOverOccurrence } from '@libs/antipattern';
import { Project } from '@libs/ontouml';

describe('RelOver Test', () => {
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
