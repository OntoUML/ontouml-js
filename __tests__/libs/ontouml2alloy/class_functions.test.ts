import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy, generateFact, generateWorldAttribute, generateWorldFact } from './helpers';
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
        model.createEvent('Birthday');
        expect(generateAlloy(model)).not.toContain('Birthday');
    });

    it('should ignore classes if they are a <<situation>>', () => {
        model.createSituation('Hazard')
        expect(generateAlloy(model)).not.toContain('Hazard');
    });

    it('should ignore classes if they are a <<type>>', () => {
        model.createType('PaymentMethod')
        expect(generateAlloy(model)).not.toContain('PaymentMethod');

    })
  
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
        expect(result).toContain(generateWorldFact('Person','Object'));
    });  

    it('should generate rigid fact for transforming <<collective>> class', () => {
        model.createCollective('Group', false);
        const result = generateAlloy(model);
        expect(result).toContain(generateWorldAttribute('Group','Object'))
        // expect(result).toContain(generateWorldFact('Group','Object'));
        // expect(result).toContain(generateFact('rigid',['rigidity[Group,Object,exists]']));
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
 
        expect(result).toContain(generateFact('rigid',['rigidity[Wine,Object,exists]']));
        expect(result).toContain(generateWorldAttribute('Wine','Object'));
        expect(result).toContain(generateWorldFact('Wine','Object'));
    });

    it('should transform <<quality>> class', () => {
      model.createQuality('Strong');
      const result = generateAlloy(model);

      expect(result).toContain(generateFact('rigid',['rigidity[Strong,Aspect,exists]']));
      expect(result).toContain(generateWorldAttribute('Strong','Aspect'));
      expect(result).toContain(generateWorldFact('Strong','Aspect'));

    });

    it('should transform «relator» class', () => {
        model.createRelator('Marriage');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Marriage,Aspect,exists]']));
        expect(result).toContain(generateWorldAttribute('Marriage','Aspect'));
        expect(result).toContain(generateWorldFact('Marriage','Aspect'));
      });

    it('should transform «role» class', () => {
        model.createRole('Student');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('antirigid',['antirigidity[Student,Object,exists]']));
        expect(result).toContain(generateWorldAttribute('Student','Object'));
        expect(result).toContain(generateWorldFact('Student','Object'));
      });

      it('should transform «phase» class', () => {
        model.createPhase('Child');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('antirigid',['antirigidity[Child,Object,exists]']));
        expect(result).toContain(generateWorldAttribute('Child','Object'));
        expect(result).toContain(generateWorldFact('Child','Object'));
      });

    //   it('should transform «abstract» class', () => {
    //     const model = new Package();
    //     model.createAbstract('Goal');
        
    //     const result = generateAlloy(model);

    //     expect(result).toContain(''); 
    //   }); //make it a datatype

      // model.createClass()

      it('should transform «mode» class { allowed=[intrinsic-mode] }', () => {
        model.createIntrinsicMode('Skill');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Skill,Aspect,exists]']));
        expect(result).toContain(generateWorldAttribute('Skill','Aspect'));
        expect(result).toContain(generateWorldFact('Skill','Aspect'));
      });
    
      it('should transform «mode» class { allowed=[extrinsic-mode] }', () => {
        model.createExtrinsicMode('Love');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Love,Aspect,exists]']));
        expect(result).toContain(generateWorldAttribute('Love','Aspect'));
        expect(result).toContain(generateWorldFact('Love','Aspect'));
      });
    
      it('should transform «mode» class { allowed=[intrinsic-mode, extrinsic-mode] }', () => {
        // const _class = OntoumlFactory.createMode('Belief');
        model.createClass('Belief', ClassStereotype.MODE, [OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode]);
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Belief,Aspect,exists]']));
        expect(result).toContain(generateWorldAttribute('Belief','Aspect'));
        expect(result).toContain(generateWorldFact('Belief','Aspect'));
      });

      // it('should transform «roleMixin» class', () => {
      //   model.createRoleMixin('Customer',);
      //   const result = generateAlloy(model);
    
      //   expect(result).toContain('');
      //   console.log(result);
      // });//diff between roleMIxin and role?
    
      // it('should transform «phaseMixin» class', () => {
      //   model.createPhaseMixin('Infant');
      //   const result = generateAlloy(model);
    
      //   expect(result).toContain('');
      // });//diff between phaseMixin and phase
    
      // it('should transform «mixin» class', () => {
      //   model.createMixin('Seatable');
      //   const result = generateAlloy(model);
    
      //   expect(result).toContain('');
      // });
      //what is expected with the mixins, semirigid?


      it('should handle if class has a space in name', () => {
        model.createKind('Happy Person');

        const result = generateAlloy(model);
        expect(result).not.toContain(generateFact('rigid',['rigidity[Happy Person,Object,exists]']));
        expect(result).toContain(generateFact('rigid',['rigidity[HappyPerson,Object,exists]']));

        expect(result).toContain(generateWorldAttribute('HappyPerson','Object'));
        expect(result).toContain(generateWorldFact('HappyPerson','Object'));
      });

      it('should handle if class has forbidden characters in name', () => { //!, #, *, /, \
        model.createKind('Happy!Person');
        const result = generateAlloy(model);

        expect(result).not.toContain(generateFact('rigid',['rigidity[Happy!Person,Object,exists]']));
        //idea for how to handle this - remove char and add a number
        // expect(result).toContain(expectedFacts);
      });

      it ('should handle if 2 classes have the same name', () => {

        model.createKind('Person');
        model.createKind('Person');

        console.log(generateAlloy(model));
      }) 

      //what should happen if a model, only containing a <<subkind>> is transformed 
      it ('should handle if 2 classes have the same name', () => {

        model.createSubkind('Worker');

        console.log(generateAlloy(model));
      }) 

      //Happy Person & HappyPerson
      //check two attributes same name
      //check reserved keywords
      //add a map to keep track of transformed classes
      //class with no name
      //class with name just spaces/special characters

      //test behaviour if subkind but no parentclass


    });
});

  