import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy } from '@libs/ontouml2alloy/helper';
import { Class, ClassStereotype, Relation, Package, Project, Property, OntoumlType, AggregationKind, stereotypeUtils, OntologicalNature} from '@libs/ontouml';
import { transformClass } from '@libs/ontouml2alloy/class_functions';

import { MultilingualText } from '@libs/ontouml';


describe('Class Functions', () => {

    describe('transformClass function', () => {
        
        let project: Project;
        let model: Package;
        let transformer: Ontouml2Alloy;

        // const eventClass = new Class({ name: new MultilingualText('Event'), stereotype: ClassStereotype.EVENT});
        // const situationClass = new Class({ name: new MultilingualText('Situation'), stereotype: ClassStereotype.SITUATION });
        // const datatypeClass = new Class({ name: new MultilingualText('DataType'), stereotype: ClassStereotype.DATATYPE });
        // const enumerationClass = new Class({ name: new MultilingualText('Enumeration'), stereotype: ClassStereotype.ENUMERATION });
        // const endurantClass = new Class({ name: new MultilingualText('Endurant'), isAbstract: false });
        // const relatorClass = new Class({ name: new MultilingualText('Relator'), stereotype: ClassStereotype.RELATOR });
        // const abstractClass = new Class({ name: new MultilingualText('AbstractClass'), isAbstract: true });
        
        beforeEach(() => {
        project = new Project();
        model = project.createModel();
      });

      it('should return early if the class has stereotype EVENT or SITUATION', () => {
        // model.createKind('Happy Person');
        const event = model.createEvent('Birthday');
        expect(generateAlloy(model)).not.toContain('Birthday');
        model.removeContent(event);

        model.createSituation('Hazard')
        expect(generateAlloy(model)).not.toContain('Hazard');
        // expect(transformer.getAlloyCode()[0]).toContain('HappyPerson: set exists:>Object');
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
      
    it('should transform datatype classes', () => {
        const _number = model.createDatatype('Number');
        const complexDatatype = model.createDatatype('Date');
        complexDatatype.createAttribute(_number, 'day');
        complexDatatype.createAttribute(_number, 'month');
        complexDatatype.createAttribute(_number, 'year');
        const result = generateAlloy(model);
        expect(result).toContain('sig Date in Datatype {');        
        expect(result).toContain('day: Number');
        expect(result).toContain('month: Number');
        expect(result).toContain('year: Number');
    }); //default multiplicy is "one" so "day: one Number" or "day: Number" should be the same

    it('transforms enumeration classes', () => {
        
        });


    it('transforms endurant class', () => {

        // endurantClass.addName('Person');
        // endurantClass.stereotype = ClassStereotype.KIND;
        // // console.log(endurantClass.getAllowedStereotypes());
        // console.log(endurantClass.getName());
        // console.log(endurantClass.getAllContents());
        // console.log(endurantClass.toJSON());

        // stereotypeUtils.isEndurantClassStereotype    
        // transformClass(transformer, endurantClass);
        // transformer.transform();
    
        // const expectedFacts = [
        //     'fact rigid {\n' +
        //     '        rigidity[Person,Endurant,exists]\n' +
        //     '}',
        // ];

        // console.log(transformer.getAlloyCode()[0]);
        // expect(transformer.getAlloyCode()[0]).toContain(expectedFacts);

        });  







    });
});

  