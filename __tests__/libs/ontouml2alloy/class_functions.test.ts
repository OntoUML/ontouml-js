import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy, generateFact, generateWorldAttribute, generateWorldFact } from '@libs/ontouml2alloy/helper';
import { Class, ClassStereotype, Relation, Package, Project, Property, OntoumlType, AggregationKind, stereotypeUtils, OntologicalNature} from '@libs/ontouml';
import { resolve } from 'dns';


describe('Class Functions', () => {

    describe('transformClass function', () => {
        let project: Project;
        let model: Package;
        let transformer: Ontouml2Alloy;

        beforeEach(() => {
        project = new Project();
        model = project.createModel();
      });

    it('should ignore classes if they are an <<event>>', () => {
        const event = model.createEvent('Birthday');
        expect(generateAlloy(model)).not.toContain('Birthday');
    });

    it('should ignore classes if they are a <<situation>>', () => {
        model.createSituation('Hazard')
        expect(generateAlloy(model)).not.toContain('Hazard');
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
    
    //add  
    it('should transform <<datatype>> class with attributes (complex datatype)', () => {
        const _number = model.createDatatype('Number');
        const complexDatatype = model.createDatatype('Date');
        complexDatatype.createAttribute(_number, 'day');

        const result = generateAlloy(model);
        const factLines = ['Datatype = Number+Date','disjoint[Number,Date]'];

        expect(result).toContain('sig Date in Datatype {\n        day: Number\n}');        
        expect(result).toContain(generateFact('additionalDatatypeFacts',factLines));
    }); //default multiplicy is "one" so "day: one Number" or "day: Number" should be the same

    it('should transform <<datatype>> class without attributes (primitive datatype)', () => {
        const model = new Package();
        model.createDatatype('Date');
        const result = generateAlloy(model);
        expect(result).toContain('sig Date in Datatype {');
        expect(result).toContain(generateFact('additionalDatatypeFacts',['Datatype = Date']))
    });

    it('should transform <<enumeration>> class with attributes', () => {
        const status = model.createEnumeration('Status');
        status.createLiteral('Active');
        status.createLiteral('Inactive');

        const result = generateAlloy(model)
        expect(result).toContain('enum Status {\n        Active, Inactive}')
    });


    it('should transform <<kind>> class', () => {
        model.createKind('Person');
        const result = generateAlloy(model);
        expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']));
        expect(result).toContain(generateWorldAttribute('Person','Object'));
        expect(result).toContain(generateWorldFact('Person','Object')); //to change
        console.log(result);
    });  

    it('should generate rigid fact for transforming <<collective>> class', () => {
        model.createCollective('Group', false);
        const result = generateAlloy(model);
        expect(result).toContain(generateFact('rigid',['rigidity[Group,Object,exists]']));
    });
    //change member -> same thing -> isExtensional - false

    // it('should generate fact to handle {isExtensional = True} for transforming <<collective>> class', () => {
    //     model.createCollective('FixedGroup', true);
    //     const result = generateAlloy(model);
        
    // }); //TODO

    
    // it('should generate fact to handle {isExtensional = False} for transforming <<collective>> class', () => {
    //     model.createCollective('FixedGroup', true);
    //     const result = generateAlloy(model);
        
    // });

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

    //   it('should transform «abstract» class', () => {
    //     const model = new Package();
    //     model.createAbstract('Goal');
        
    //     const result = generateAlloy(model);

    //     expect(result).toContain(''); 
    //   }); //TODO


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
        model.createRoleMixin('Customer',);
        const result = generateAlloy(model);
    
        expect(result).toContain('');
        console.log(result);
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

  