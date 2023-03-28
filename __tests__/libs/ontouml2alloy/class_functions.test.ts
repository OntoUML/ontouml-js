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

    it('should return early if the class is an <<event>> or <<situation>>', () => {
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
      
    it('should transform <<datatype>> class with attributes (complex datatype)', () => {
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

    it('should NOT transform «datatype» class without attributes (primitive datatype)', () => {
        const model = new Package();
        model.createDatatype('Date');
        const result = generateAlloy(model);

        expect(result).not.toContain('sig Date in Datatype {');
    }); //should there be such a requirement?

    it('should transform <<enumeration>> class with attributes', () => {
        const status = model.createEnumeration('Status');
        status.createLiteral('Active');
        status.createLiteral('Inactive');

        const result = generateAlloy(model)
        expect(result).toContain('enum Status {')
        expect(result).toContain('Active, Inactive}')
    });


    it('should transform <<kind>> class', () => {
        model.createKind('Person');
        const expectedFacts = 
            'fact rigid {\n' +
            '        rigidity[Person,Object,exists]\n' +
            '}'
        ;
        expect(generateAlloy(model)).toContain(expectedFacts);
        // console.log(generateAlloy(model));
        //"exists:>Object in Group" ?
    });  

    it('should transform <<collective>> class { isExtensional=false }', () => {
        model.createCollective('Group', false);
        const result = generateAlloy(model);
        const expectedFacts = 
            'fact rigid {\n' +
            '        rigidity[Group,Object,exists]\n' +
            '}'
        ;
        expect(result).toContain(expectedFacts);
    });

    it('should transform «collective» class { isExtensional=true }', () => {
        model.createCollective('FixedGroup', true);
        const result = generateAlloy(model);
        
    });

    it('should transform «quantity» class', () => {
        model.createQuantity('Wine');
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact rigid {\n' +
        '        rigidity[Wine,Object,exists]\n' +
        '}'
        ; 
        expect(result).toContain(expectedFacts);
    });

    it('should transform «relator» class', () => {
        model.createRelator('Marriage');
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact rigid {\n' +
        '        rigidity[Marriage,Aspect,exists]\n' +
        '}'
        ;
        expect(result).toContain(expectedFacts);
      }); //that's it, I guess?

    it('should transform «role» class', () => {
        model.createRole('Student');
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact antirigid {\n' +
        '        antirigidity[Student,Object,exists]\n' +
        '}'
        ;
        expect(result).toContain(expectedFacts);
      });

      it('should transform «phase» class', () => {
        model.createPhase('Child');
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact antirigid {\n' +
        '        antirigidity[Child,Object,exists]\n' +
        '}'
        ;
        expect(result).toContain(expectedFacts);
      });

      it('should transform «abstract» class', () => {
        const model = new Package();
        model.createAbstract('Goal');
        
        const result = generateAlloy(model);

        expect(result).toContain(''); // to be figured out what needs to happen
      });

      it('should transform «mode» class { allowed=[intrinsic-mode] }', () => {
        model.createIntrinsicMode('Skill');
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact rigid {\n' +
        '        rigidity[Skill,Aspect,exists]\n' +
        '}'
        ;

        expect(result).toContain(expectedFacts);
    
      });
    
      it('should transform «mode» class { allowed=[extrinsic-mode] }', () => {
        model.createExtrinsicMode('Love');
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact rigid {\n' +
        '        rigidity[Love,Aspect,exists]\n' +
        '}'
        ;
        expect(result).toContain(expectedFacts);
      });
    
      it('should transform «mode» class { allowed=[intrinsic-mode, extrinsic-mode] }', () => {
        // const _class = OntoumlFactory.createMode('Belief');
        model.createClass('Belief', ClassStereotype.MODE, [OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode]);
        const result = generateAlloy(model);
        const expectedFacts = 
        'fact rigid {\n' +
        '        rigidity[Belief,Aspect,exists]\n' +
        '}'
        ;
        expect(result).toContain(expectedFacts);
      });

      it('should transform «roleMixin» class', () => {
        model.createRoleMixin('Customer');
        const result = generateAlloy(model);
    
        expect(result).toContain('');
      });
    
      it('should transform «phaseMixin» class', () => {
        model.createPhaseMixin('Infant');
        const result = generateAlloy(model);
    
        expect(result).toContain('');
      });
    
      it('should transform «mixin» class', () => {
        model.createMixin('Seatable');
        const result = generateAlloy(model);
    
        expect(result).toContain('');
      });
      //what is expected with the mixins?


      it('should handle if class has a space in name', () => {
        model.createKind('Happy Person');
        const unwantedFacts = 
        'fact rigid {\n' +
        '        rigidity[Happy Person,Object,exists]\n' +
        '}'
        ;
        const expectedFacts = 
        'fact rigid {\n' +
        '        rigidity[HappyPerson,Object,exists]\n' +
        '}'
        ;
        const result = generateAlloy(model);
        expect(result).not.toContain(unwantedFacts);
        expect(result).toContain(expectedFacts);
      });

      it('should handle if class has forbidden characters in name', () => { //!, #, *, /, \
        model.createKind('Happy!Person');
        const unwantedFacts = 
        'fact rigid {\n' +
        '        rigidity[Happy!Person,Object,exists]\n' +
        '}'
        ;
        const result = generateAlloy(model);
        expect(result).not.toContain(unwantedFacts);
        //idea for how to handle this
        // expect(result).toContain(expectedFacts);
      });

      


    });
});

  