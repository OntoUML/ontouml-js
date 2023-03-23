import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { Class, ClassStereotype, Relation, Package, Project, Property, OntoumlType, AggregationKind, stereotypeUtils, OntologicalNature} from '@libs/ontouml';
import { transformClass } from '@libs/ontouml2alloy/class_functions';

import { MultilingualText } from '@libs/ontouml';

// describe('transformEndurantClass', () => {
//   test('should transform endurant class into Alloy field declaration', () => {
//     // Create a new Ontouml2Alloy instance and a Class instance
//     const transformer = new Ontouml2Alloy();
//     const classInstance = new Class('Person');

//     // Set the classInstance as restricted to Substantial
//     classInstance.setRestrictedToSubstantial(true);

//     // Call the transformEndurantClass function with the transformer and the classInstance
//     transformEndurantClass(transformer, classInstance);

//     // Check that the transformer now contains the expected Alloy field declaration
//     expect(transformer.getFacts()).toContain('Person: set exists:>Object');
//   });
// });

describe('Class Functions', () => {

    describe('transformClass function', () => {
        
        let project: Project;
        let model: Package;
        let transformer: Ontouml2Alloy;

        const eventClass = new Class({ name: new MultilingualText('Event'), stereotype: ClassStereotype.EVENT});
        const situationClass = new Class({ name: new MultilingualText('Situation'), stereotype: ClassStereotype.SITUATION });
        const datatypeClass = new Class({ name: new MultilingualText('DataType'), stereotype: ClassStereotype.DATATYPE });
        const enumerationClass = new Class({ name: new MultilingualText('Enumeration'), stereotype: ClassStereotype.ENUMERATION });
        const endurantClass = new Class({ name: new MultilingualText('Endurant'), isAbstract: false });
        const relatorClass = new Class({ name: new MultilingualText('Relator'), stereotype: ClassStereotype.RELATOR });
        const abstractClass = new Class({ name: new MultilingualText('AbstractClass'), isAbstract: true });
        
        beforeEach(() => {
        project = new Project();
        model = project.createModel();

        transformer = new Ontouml2Alloy(model); //necessary to use the transform func
      });

      it('returns early if the class has stereotype EVENT or SITUATION', () => {
        const resultEvent = transformClass(transformer, eventClass);
        const resultSituation = transformClass(transformer, situationClass);
        expect(resultEvent).toBeUndefined();
        expect(resultSituation).toBeUndefined();
      });
  
    //   afterEach(() => {
    //     // code to run after each test case
    //   });
  
    //   beforeAll(() => {
    //     // code to run before all test cases
    //   });
  
    //   afterAll(() => {
    //     // code to run after all test cases
    //   });
  
    //   it('should do X when Y is provided', () => {
    //     // Arrange
    //     //const input = ...; // the input value for the function or class method
    //     //const expectedOutput = ...; // the expected output of the function or class method
  
    //     // Act
    //     //const actualOutput = ...; // call the function or class method with the input value
  
    //     // Assert
    //     //expect(actualOutput).toEqual(expectedOutput);
    //   });
  
    //   it('should throw an error when Z is provided', () => {
    //     // Arrange
    //     //const input = ...; // the input value for the function or class method that should throw an error
  
    //     // Assert
    //     //expect(() => ...).toThrow(); // call the function or class method with the input value and expect it to throw an error
    //   });
      
    it('transforms datatype classes', () => {
    
        });

    it('transforms enumeration classes', () => {
        
        });


    it('transforms endurant class', () => {

        endurantClass.addName('Person');
        endurantClass.stereotype = ClassStereotype.KIND;
        // console.log(endurantClass.getAllowedStereotypes());
        console.log(endurantClass.getName());
        console.log(endurantClass.getAllContents());
        console.log(endurantClass.toJSON());

        stereotypeUtils.isEndurantClassStereotype    
        transformClass(transformer, endurantClass);
        transformer.transform();
    
        const expectedFacts = [
            'fact rigid {\n' +
            '        rigidity[Person,Endurant,exists]\n' +
            '}',
        ];

        console.log(transformer.getAlloyCode()[0]);
        expect(transformer.getAlloyCode()[0]).toContain(expectedFacts);

        });  







    });
});

  