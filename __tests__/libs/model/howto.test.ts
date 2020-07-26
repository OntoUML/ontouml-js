import { ModelManager } from '@libs/model';
import { OntoUMLType } from '@constants/.';
import { IClass, IElement } from '@types';
import { genericExample1 } from '@test-models/valids';

it('Check README How To code', () => {
  const ontoULMSchemaModel = genericExample1;

  const modelManager = new ModelManager(ontoULMSchemaModel);

  const rootPackage = modelManager.rootPackage; // ontoULMSchemaModel root package
  rootPackage.getAllContents(); // returns elements recursively contained within the executing package
  rootPackage.getAllContentsByType([OntoUMLType.GENERALIZATION_TYPE, OntoUMLType.PROPERTY_TYPE]); // returns elements contained within in the package selected by type
  rootPackage.getContentById('elementId'); // returns the element bearering the given id

  const student = rootPackage.getAllContents().find((element: IElement) => element.name === 'Student') as IClass; // Student role class
  student.stereotypes; // [ 'role' ]
  student.getParents(); // [ Person kind class ]
  student.getAncestors(); // [ Person kind class, Agent category class ]
  student.getChildren(); // [ Privately Enrolled role class, Privately Enrolled role class ]
  student.getDescendants(); // [ Privately Enrolled role class, Privately Enrolled role class ]

  const enrollmentDate = rootPackage
    .getAllContents()
    .find((element: IElement) => element.name === 'Enrollment Date') as IClass; // Enrollment Date mode class
  enrollmentDate.properties[0]; // date property representing the class's attibute
  enrollmentDate.getRootPackage; // returns rootPackage
});
