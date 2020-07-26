import fs from 'fs';
import { complexityClustering, complexityNonSortals } from '@test-models/valids';
import { IPackage, IClass } from '@types';
import { ClusterFinder, getDescendantsNonSortalLine } from '@libs/complexity';
import { ModelManager } from '@libs/model';
import { ClassStereotype } from '@constants/.';
import { Diagram } from '@libs/complexity/diagram';

function generateDiagrams(filename: string, model: IPackage): Diagram[] {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new ClusterFinder(modelManager);

  const output = service.find();

  const baseFilepath = '__tests__/libs/complexity/examples/';
  const filepath = baseFilepath + filename + '.json';
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));

  return output;
}

describe('Examples', () => {
  let diagrams: Diagram[];

  beforeAll(() => {
    diagrams = generateDiagrams('paperExample', complexityClustering);
  });

  it('Should generate 4 diagrams', () => {
    expect(diagrams).toHaveLength(4);
  });

  describe('Marriage cluster', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.name === 'Cluster of Marriage');
    });

    it('Should contain the expected classes', () => {
      expectDiagramToContain(diagram, 'marriage-shape');
      expectDiagramToContain(diagram, 'wife-shape');
      expectDiagramToContain(diagram, 'husband-shape');
      expectDiagramToContain(diagram, 'woman-shape');
      expectDiagramToContain(diagram, 'man-shape');
      expectDiagramToContain(diagram, 'person-shape');
    });

    it('Should contain 6 shapes (classes)', () => {
      expect(diagram.contents.filter(element => element.type === 'Shape').length).toEqual(6);
    });

    it('Should contain 6 links (relations and generalizations)', () => {
      expect(diagram.contents.filter(element => element.type === 'Line').length).toEqual(6);
    });

    it('Should contain 1 labels (generalizations sets)', () => {
      expect(diagram.contents.filter(element => element.type === 'Label').length).toEqual(1);
    });
  });

  describe('Car Rental cluster', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.name === 'Cluster of Car Rental');
    });

    it('Should contain the expected classes', () => {
      expectDiagramToContain(diagram, 'car-rental-shape');

      expectDiagramToContain(diagram, 'responsible-employee-shape');
      expectDiagramToContain(diagram, 'employee-shape');
      expectDiagramToContain(diagram, 'person-shape');

      expectDiagramToContain(diagram, 'customer-shape');
      expectDiagramToContain(diagram, 'personal-customer-shape');
      expectDiagramToContain(diagram, 'adult-shape');
      expectDiagramToContain(diagram, 'teenager-shape');
      expectDiagramToContain(diagram, 'child-shape');
      expectDiagramToContain(diagram, 'living-person-shape');
      expectDiagramToContain(diagram, 'deceased-person-shape');
      expectDiagramToContain(diagram, 'corporate-customer-shape');
      expectDiagramToContain(diagram, 'organization-shape');

      expectDiagramToContain(diagram, 'rental-car-shape');
      expectDiagramToContain(diagram, 'available-car-shape');
      expectDiagramToContain(diagram, 'under-maintenance-car-shape');
      expectDiagramToContain(diagram, 'car-shape');
    });

    it('Should contain 17 shapes (classes)', () => {
      expect(diagram.contents.filter(element => element.type === 'Shape').length).toEqual(17);
    });

    it('Should contain 17 links (relations and generalizations)', () => {
      expect(diagram.contents.filter(element => element.type === 'Line').length).toEqual(17);
    });

    it('Should contain 4 labels (generalizations sets)', () => {
      expect(diagram.contents.filter(element => element.type === 'Label').length).toEqual(4);
    });
  });
});

function expectDiagramToContain(diagram: Diagram, id: string) {
  const element = diagram.contents.find(element => element.id === id);
  expect(element).toBeTruthy();
}

describe('Non sortal line', () => {
  it('Should return direct sortal children only', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const musicalArtist = modelManager.getElementById('R2SB0c6GAqACAg52');
    const children = getDescendantsNonSortalLine(musicalArtist);

    expect(children).toHaveLength(2);

    expectToContainClass(children, 'Band', ClassStereotype.COLLECTIVE);
    expectToContainClass(children, 'Singer', ClassStereotype.ROLE);
  });

  it('Should return leaf sortal descendants', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const physicalObject = modelManager.getElementById('tvoJ0c6GAqACAhO5');
    const children = getDescendantsNonSortalLine(physicalObject);

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
    const children = getDescendantsNonSortalLine(physicalObject);

    expectToContainClass(children, 'Machine', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Vehicle', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Computer', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Furniture', ClassStereotype.CATEGORY);
  });

  it('Should return sortal and non-sortal descendants', () => {
    const modelCopy = JSON.parse(JSON.stringify(complexityNonSortals));
    const modelManager = new ModelManager(modelCopy);

    const agent = modelManager.getElementById('Lb0.0c6GAqACAgv9');
    const children = getDescendantsNonSortalLine(agent);

    expect(children).toHaveLength(4);

    expectToContainClass(children, 'Animal', ClassStereotype.CATEGORY);
    expectToContainClass(children, 'Person', ClassStereotype.KIND);
    expectToContainClass(children, 'Dog', ClassStereotype.KIND);
    expectToContainClass(children, 'Robot', ClassStereotype.KIND);
  });
});

function expectToContainClass(array: IClass[], name: string, stereotype: ClassStereotype) {
  const _class = array.find(c => c.name === name);
  expect(_class).toBeTruthy();
  expect(_class.stereotypes[0]).toBe(stereotype);
}
