import fs from 'fs';
import { complexityExtendedExample, complexityExample } from '@test-models/valids';
import { IPackage } from '@types';
import { ClusterFinder } from '@libs/complexity';
import { ModelManager } from '@libs/model';
import { Diagram } from '@libs/complexity/diagram';

function generateDiagrams(filename: string, model: IPackage): Diagram[] {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new ClusterFinder(modelManager);

  const output = service.buildAll();

  const baseFilepath = '__tests__/libs/complexity/examples/';
  const filepath = baseFilepath + filename + '.json';
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));

  return output;
}

function expectDiagramToContain(diagram: Diagram, id: string) {
  const element = diagram.contents.find(element => element.id === id);
  expect(element).toBeTruthy();
}

function expectDiagramToExclude(diagram: Diagram, id: string) {
  const element = diagram.contents.find(element => element.id === id);
  expect(element).toBeFalsy();
}

function expectToContainDiagram(diagrams: Diagram[], name: string): Diagram {
  const diagram = diagrams.find(d => d.name === name);
  expect(diagram).toBeTruthy();
  return diagram;
}

describe('Basic clusterization example', () => {
  let diagrams: Diagram[];

  beforeAll(() => {
    diagrams = generateDiagrams('complexityExample', complexityExample);
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

describe('Extended clusterization example', () => {
  let diagrams: Diagram[];

  beforeAll(() => {
    diagrams = generateDiagrams('complexityExtendedExample', complexityExtendedExample);
  });

  it('Should generate 7 diagrams', () => {
    expect(diagrams).toHaveLength(7);
  });

  it('Should contain the expected clusters', () => {
    expectToContainDiagram(diagrams, 'Cluster of Official Commitment');
    expectToContainDiagram(diagrams, 'Cluster of Employment');
    expectToContainDiagram(diagrams, 'Cluster of Car Rental');
    expectToContainDiagram(diagrams, 'Cluster of Marriage');
    expectToContainDiagram(diagrams, 'Cluster of Car Ownership');
    expectToContainDiagram(diagrams, 'Cluster of Ownership');
    expectToContainDiagram(diagrams, 'Cluster of Rental Insurance');
  });

  describe('`Official Commitment` cluster (Non sortal relator mediating sortal types)', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.name === 'Cluster of Official Commitment');
    });

    it('Should contain the expected classes', () => {
      expectDiagramToContain(diagram, 'official-commitment-shape');
      expectDiagramToContain(diagram, 'notary-shape');
      expectDiagramToContain(diagram, 'contract-shape');
      expectDiagramToContain(diagram, 'person-shape');
    });

    it('Should contain the relation lines', () => {
      expectDiagramToContain(diagram, 'confirmed-by-line');
      expectDiagramToContain(diagram, 'formalized-by-line');
    });

    it('Should contain the expected generalizations lines', () => {
      expectDiagramToContain(diagram, 'notary-|>person-line');
    });

    it('Should contain 4 shapes (classes)', () => {
      expect(diagram.contents.filter(element => element.type === 'Shape').length).toEqual(4);
    });

    it('Should contain 3 links (relations and generalizations)', () => {
      expect(diagram.contents.filter(element => element.type === 'Line').length).toEqual(3);
    });

    it('Should contain 0 labels (generalizations sets)', () => {
      expect(diagram.contents.filter(element => element.type === 'Label').length).toEqual(0);
    });
  });

  describe('`Employement` cluster (Sortal relator that specializes a non sortal) ', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.name === 'Cluster of Employment');
    });

    it('Should contain the expected class shapes', () => {
      expectDiagramToContain(diagram, 'official-commitment-shape');
      expectDiagramToContain(diagram, 'notary-shape');
      expectDiagramToContain(diagram, 'contract-shape');
      expectDiagramToContain(diagram, 'person-shape');
      expectDiagramToContain(diagram, 'employment-shape');
      expectDiagramToContain(diagram, 'employee-shape');
      expectDiagramToContain(diagram, 'organization-shape');
    });

    it('Should contain the expected relation lines', () => {
      expectDiagramToContain(diagram, 'confirmed-by-line');
      expectDiagramToContain(diagram, 'formalized-by-line');
      expectDiagramToContain(diagram, 'involves-employee-line');
      expectDiagramToContain(diagram, 'involves-employer-line');
    });

    it('Should contain the expected generalizations lines', () => {
      expectDiagramToContain(diagram, 'notary-|>person-line');
      expectDiagramToContain(diagram, 'employee-|>person-line');
      expectDiagramToContain(diagram, 'employment-|>official-commitment-line');
    });

    it('Should contain 7 shapes (classes)', () => {
      expect(diagram.contents.filter(element => element.type === 'Shape').length).toEqual(7);
    });

    it('Should contain 7 links (relations and generalizations)', () => {
      expect(diagram.contents.filter(element => element.type === 'Line').length).toEqual(7);
    });

    it('Should contain 0 labels (generalizations sets)', () => {
      expect(diagram.contents.filter(element => element.type === 'Label').length).toEqual(0);
    });
  });

  describe('`Rental Insurance` cluster (Linked relators) ', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.name === 'Cluster of Rental Insurance');
    });

    it('Should contain the expected class shapes', () => {
      expectDiagramToContain(diagram, 'rental-insurance-shape');
      expectDiagramToContain(diagram, 'car-rental-shape');
      expectDiagramToContain(diagram, 'rental-car-shape');
      expectDiagramToContain(diagram, 'available-car-shape');
      expectDiagramToContain(diagram, 'under-maintenance-car-shape');
      expectDiagramToContain(diagram, 'car-shape');
      expectDiagramToContain(diagram, 'insurance-company-shape');
      expectDiagramToContain(diagram, 'organization-shape');
      expectDiagramToContain(diagram, 'corporate-customer-shape');
      expectDiagramToContain(diagram, 'customer-shape');
      expectDiagramToContain(diagram, 'personal-customer-shape');
      expectDiagramToContain(diagram, 'adult-shape');
      expectDiagramToContain(diagram, 'teenager-shape');
      expectDiagramToContain(diagram, 'child-shape');
      expectDiagramToContain(diagram, 'living-person-shape');
      expectDiagramToContain(diagram, 'deceased-person-shape');
      expectDiagramToContain(diagram, 'person-shape');
      expectDiagramToContain(diagram, 'employee-shape');
      expectDiagramToContain(diagram, 'responsible-employee-shape');
    });

    it('Should not contain unrelated classes shapes', () => {
      expectDiagramToExclude(diagram, 'car-agency-shape');
      expectDiagramToExclude(diagram, 'logistics-operator-shape');
    });

    it('Should contain the expected relation lines', () => {
      expectDiagramToContain(diagram, 'protects-line');
      expectDiagramToContain(diagram, 'provided-by-line');
      expectDiagramToContain(diagram, 'requested-by-line');
      expectDiagramToContain(diagram, 'processed-by-line');
      expectDiagramToContain(diagram, 'includes-line');
    });

    it('Should contain the expected generalizations lines', () => {
      expectDiagramToContain(diagram, 'living-person-|>person-line');
      expectDiagramToContain(diagram, 'deceased-person-|>person-line');
      expectDiagramToContain(diagram, 'employee-|>person-line');
      expectDiagramToContain(diagram, 'responsible-employee-|>employee-line');
      expectDiagramToContain(diagram, 'child-|>living-person-line');
      expectDiagramToContain(diagram, 'teenager-|>living-person-line');
      expectDiagramToContain(diagram, 'adult-|>living-person-line');
      expectDiagramToContain(diagram, 'personal-customer-|>adult-line');
      expectDiagramToContain(diagram, 'personal-customer-|>customer-line');
      expectDiagramToContain(diagram, 'corporate-customer-|>customer-line');
      expectDiagramToContain(diagram, 'corporate-customer-|>organization-line');
      expectDiagramToContain(diagram, 'rental-car-|>available-car-line');
      expectDiagramToContain(diagram, 'available-car-|>car-line');
      expectDiagramToContain(diagram, 'under-maintenance-car-|>car-line');
      expectDiagramToContain(diagram, 'insurance-company-|>organization-line');
    });

    it('Should contain 19 shapes (classes)', () => {
      expect(diagram.contents.filter(element => element.type === 'Shape').length).toEqual(19);
    });

    it('Should contain 20 links (relations and generalizations)', () => {
      expect(diagram.contents.filter(element => element.type === 'Line').length).toEqual(20);
    });

    it('Should contain 4 labels (generalizations sets)', () => {
      expect(diagram.contents.filter(element => element.type === 'Label').length).toEqual(4);
    });
  });
});
