import { AntiPatternFinder, RelOverAntiPattern } from '@libs/antipattern';
import { Project } from '@libs/ontouml';

describe('antipatterntest', () => {
  it('checking true', () => {
    const project = new Project();
    const model = project.createModel();
    const person = model.createKind('Person');
    const man = model.createSubkind('Man');

    const gen = model.createGeneralization(person, man);
    const genSet = model.createGeneralizationSet(gen, false, false);

    console.log(genSet);

    const service = new AntiPatternFinder(project);

    const didItFindTheAntiPattern = RelOverAntiPattern.checkIncompleteGeneralizationSet(project);
    // console.log(service);

    expect(service.project).toBe(project);
    expect(didItFindTheAntiPattern).toBe(false);
  });
});
