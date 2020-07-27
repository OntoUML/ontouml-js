import { complexityNonSortals } from '@test-models/valids';
import { IClass } from '@types';
import { ClusterFinder } from '@libs/complexity';
import { ModelManager } from '@libs/model';
import { ClassStereotype } from '@constants/.';

function expectToContainClass(array: IClass[], name: string, stereotype: ClassStereotype) {
  const _class = array.find(c => c.name === name);
  expect(_class).toBeTruthy();
  expect(_class.stereotypes[0]).toBe(stereotype);
}

describe('getDescendantsNonSortalLine()', () => {
  it('Should return direct sortal children only', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const musicalArtist = modelManager.getElementById('R2SB0c6GAqACAg52');
    const children = ClusterFinder.getDescendantsNonSortalLine(musicalArtist);

    expect(children).toHaveLength(2);

    expectToContainClass(children, 'Band', ClassStereotype.COLLECTIVE);
    expectToContainClass(children, 'Singer', ClassStereotype.ROLE);
  });

  it('Should return leaf sortal descendants', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const physicalObject = modelManager.getElementById('tvoJ0c6GAqACAhO5');
    const children = ClusterFinder.getDescendantsNonSortalLine(physicalObject);

    expectToContainClass(children, 'Airplane', ClassStereotype.KIND);
    expectToContainClass(children, 'Car', ClassStereotype.KIND);
    expectToContainClass(children, 'Desktop', ClassStereotype.KIND);
    expectToContainClass(children, 'Laptop', ClassStereotype.KIND);
    expectToContainClass(children, 'Bed', ClassStereotype.KIND);
    expectToContainClass(children, 'Table', ClassStereotype.KIND);
    expectToContainClass(children, 'Chair', ClassStereotype.KIND);
  });

  it('Should return non-leaf non-sortal descendants', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const physicalObject = modelManager.getElementById('tvoJ0c6GAqACAhO5');
    const children = ClusterFinder.getDescendantsNonSortalLine(physicalObject);

    expectToContainClass(children, 'Machine', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Vehicle', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Computer', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Furniture', ClassStereotype.CATEGORY);
  });

  it('Should return sortal and non-sortal descendants', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const agent = modelManager.getElementById('Lb0.0c6GAqACAgv9');
    const children = ClusterFinder.getDescendantsNonSortalLine(agent);

    expect(children).toHaveLength(4);

    expectToContainClass(children, 'Animal', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Person', ClassStereotype.KIND);
    expectToContainClass(children, 'Dog', ClassStereotype.KIND);
    expectToContainClass(children, 'Robot', ClassStereotype.KIND);
  });
});
