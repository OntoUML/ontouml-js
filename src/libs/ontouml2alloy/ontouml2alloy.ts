import { OntoumlElement, Project, Package, Decoratable, Stereotype } from '@libs/ontouml';
import {
  transformProperty,
  transformClass,
  transformAdditionalClassConstraints,
  transformAdditionalDatatypeConstraints,
  transformCharacterizationConstraint,
  transformGeneralization,
  transformGeneralizationSet,
  transformRelation
} from './';
import { Service, ServiceIssue, ServiceIssueSeverity } from '..';
import { type } from 'os';

export class Ontouml2Alloy implements Service {
  model: Package;
  alloyCode: string[]; // [mainModule, worldStructureModule, ontologicalPropertiesModule]
  datatypes: [string, string[]][]; // [datatypeName, datatypeProperties]
  enums: string[];
  worldFieldDeclarations: string[];
  worldFieldFacts: string[];
  facts: string[];
  relationPropertiesFacts: string[];
  funs: string[];
  visible: string[];
  aliases: [OntoumlElement, string][]; //[element, alias]; used in transformRelatorConstraint
  normalizedNames: { [key: string]: string }; //added; OntoumlElement ID, normalizedName
  issues: ServiceIssue[]; //added, to store removed elements

  /*
    Lines 13-33 define a class Ontouml2Alloy that implements Service. The class has a constructor
    with an input parameter that can be either a Project or a Package object. The class has many properties 
    that are used to store the different parts of the Alloy code generated during the transformation process. 
    The transform() method is the main method of the class that orchestrates the transformation process.
  */

  constructor(input: Project | Package, options?: null) {
    if (input instanceof Project) {
      this.model = input.model;
    } else if (input instanceof Package) {
      this.model = input;
    }
    this.alloyCode = ['', '', ''];
    this.datatypes = [];
    this.enums = [];
    this.worldFieldDeclarations = [];
    this.worldFieldFacts = [];
    this.facts = [];
    this.relationPropertiesFacts = [];
    this.funs = [];
    this.visible = ['exists'];
    this.aliases = [];
    this.normalizedNames = {} //added
    this.issues = [] //added
  }

  getAlloyCode(): string[] {
    return this.alloyCode;
  }

  getFacts(): string[] {
    return this.facts;
  } //getter to test

  getDatatype() : [string, string[]][]{
    return this.datatypes;
  } //getter to test

  getAliases(){
    return this.aliases;
  }

  addDatatype(datatype: [string, string[]]) {
    this.datatypes.push(datatype);
  }

  addEnum(_enum: string) {
    this.enums.push(_enum);
  }

  addWorldFieldDeclaration(declaration: string) {
    this.worldFieldDeclarations.push(declaration);
  }

  addWorldFieldFact(fact: string) {
    this.worldFieldFacts.push(fact);
  }

  addFact(fact: string) {
    this.facts.push(fact);
  }

  addRelationPropertiesFact(relationPropertiesFact: string) {
    this.relationPropertiesFacts.push(relationPropertiesFact);
  }

  addFun(fun: string) {
    this.funs.push(fun);
  }

  addVisible(term: string) {
    this.visible.push(term);
  }

  transform() {
    this.removeUnsupportedElements();

    this.transformClasses();
    this.transformGeneralizations();
    this.transformGeneralizationSets();
    this.transformProperties();
    this.transformRelations();

    // removes possible duplicate facts and funs
    this.worldFieldFacts = [...new Set(this.worldFieldFacts)];
    this.facts = [...new Set(this.facts)];
    this.relationPropertiesFacts = [...new Set(this.relationPropertiesFacts)];
    this.funs = [...new Set(this.funs)];

    this.writePreamble();
    this.writeDatatypes();
    this.writeEnums();
    this.writeWorldSignature();
    this.writeFacts();
    this.writeFuns();
    this.writeRuns();

    this.writeWorldStructureModule();
    this.writeOntologicalPropertiesModule();
  }

  hasUnsupportedStereotype(decoratable: Decoratable<any>) {
    return decoratable.hasAnyStereotype(['event', 'situation' ,'type'] || decoratable == null );
  }
  
  removeUnsupportedElements() {
    const classes = this.model.getAllClasses();
    const relations = this.model.getAllRelations();
    const generalizations = this.model.getAllGeneralizations();
    const generalizationSets = this.model.getAllGeneralizationSets();

    // Remove classes with unsupported stereotypes
    for (const _class of classes) {

      if (this.hasUnsupportedStereotype(_class)) {
  
        // Remove properties of the class
        for (const property of _class.properties) {
          property.removeSelfFromContainer();
          const attributeName = property.getName() || 'with no name';
          this.generateRemovalIssue(property, `Attribute '${attributeName}' of the class '${_class.getName()}' was removed due to the class having an unsupported stereotype.`);
        }

        _class.removeSelfFromContainer();
        this.generateRemovalIssue(_class, `Class '${_class.getName()}' was removed due to having an unsupported stereotype.`);
      }
      
    }

    // Remove attributes with undefined propertyType
    for (const property of this.model.getAllAttributes()) {
      if(!property.propertyType || this.hasUnsupportedStereotype(property.propertyType)){
        property.removeSelfFromContainer();
        this.generateRemovalIssue(property, `Attribute '${property.getName()}' was removed due to undefined/unsupported propertyType.`);
      }
    }
  
    // Remove relations connected to unsupported classes
    for (const relation of relations) {
      const source = relation.getSource();
      const target = relation.getTarget();
  
      if (source && this.hasUnsupportedStereotype(source)) {
        source.removeSelfFromContainer();
        relation.removeSelfFromContainer();
        this.generateRemovalIssue(relation, `Relation '${relation.getName()}' was removed due to being connected to an unsupported class '${source.getName()}'.`);
      } else if (target && this.hasUnsupportedStereotype(target)) {
        relation.removeSelfFromContainer();
        this.generateRemovalIssue(relation, `Relation '${relation.getName()}' was removed due to being connected to an unsupported class '${target.getName()}'.`);
      }

    }
  
    // Remove generalizations consisting of unsupported elements
    for (const generalization of generalizations) {
      const source = generalization.specific;
      const target = generalization.general;
  
      if ((source && this.hasUnsupportedStereotype(source)) || (target && this.hasUnsupportedStereotype(target))) {
        generalization.removeSelfFromContainer();
        const genName = generalization.getName() || `${source.getName()} -> ${target.getName()}`;
        this.generateRemovalIssue(generalization, `Generalization '${genName}' was removed due to having an unsupported element.`);
      }
    }

    // Remove generalization sets containing unsupported elements
    for (const generalizationSet of generalizationSets) {
      if (generalizationSet.generalizations.some(gen => this.hasUnsupportedStereotype(gen.specific) || this.hasUnsupportedStereotype(gen.general))) {
          generalizationSet.removeSelfFromContainer();
          const genSetNames = generalizationSet.generalizations.map(gen => gen.getName() || `${gen.specific.getName()} -> ${gen.general.getName()}`).join(', ');
          const genSetName = generalizationSet.getName() || `{${genSetNames}}`;
  
          const removalDescription = `Generalization Set '${genSetName}' was removed due to containing an unsupported element.`;
          
          this.generateRemovalIssue(generalizationSet, removalDescription);
      }
  }

  }
  
  generateRemovalIssue(element: OntoumlElement, description: string) {
    const issue: ServiceIssue = {
      id: element.id,
      code: 'UNSUPPORTED_ELEMENT_REMOVED',
      severity: ServiceIssueSeverity.WARNING,
      title: 'Unsupported Element Removed',
      description: description,
      data: element
    };
    this.issues.push(issue);
  }
  
  
  /*
    Lines 81-105 define a method transform() that calls the different transformation functions, 
    removes duplicate facts and functions, and writes the generated Alloy code to the alloyCode property.
  */

  writePreamble() {
    this.alloyCode[0] +=
      'module main\n\n' +
      'open world_structure[World]\n' +
      'open ontological_properties[World]\n' +
      'open util/relation\n' +
      'open util/sequniv\n' +
      'open util/ternary\n\n' +
      'abstract sig Endurant {}\n\n' +
      'sig Object extends Endurant {}\n\n' +
      'sig Aspect extends Endurant {}\n\n' +
      'sig Datatype {}\n\n';
  }

  writeDatatypes() {
    for (const datatype of this.datatypes) {
      const datatypeName = datatype[0];
      const datatypeProperties = [... new Set(datatype[1])];

      if (datatypeProperties.length) {
        this.alloyCode[0] +=
          'sig ' + datatypeName + ' in Datatype {\n' + 
          '        ' + datatypeProperties.join(',\n        ') + '\n' +
          '}\n\n'
      } else {
        this.alloyCode[0] +=
          'sig ' + datatypeName + ' in Datatype {}\n\n'
      }
    }
  }

  writeEnums() {
    if (this.enums.length) {
      this.alloyCode[0] +=
        this.enums.join('\n\n') +
        '\n\n';
    }
  }

  writeWorldSignature() {
    this.alloyCode[0] +=
      'abstract sig World {\n' +
      '        exists: some Endurant,\n' +
      '        ' + this.worldFieldDeclarations.join(',\n        ') + '\n' +
      '}';
    if(this.worldFieldFacts.length) {
      this.alloyCode[0] +=
        ' {\n' +
        '        '+ this.worldFieldFacts.join('\n        ') + '\n' +
        '}';
    }
    this.alloyCode[0] += '\n\n';
  }

  writeFacts() {
    this.alloyCode[0] +=
      'fact additionalFacts {\n' +
      '        continuous_existence[exists]\n' +
      '        elements_existence[Endurant,exists]\n' +
      '}\n\n';

    if (this.relationPropertiesFacts.length) {
      this.alloyCode[0] += 
        'fact relationProperties {\n' +
        '        '+ this.relationPropertiesFacts.join('\n        ') + '\n' +
        '}\n\n'
    }
    
    if (this.facts.length) {
      this.alloyCode[0] += 
        this.facts.join('\n\n') +
        '\n\n';
    }
  }

  writeFuns() {
    this.alloyCode[0] +=
      'fun visible : World->univ {\n' +
      '        ' + this.visible.join('+') + '\n' +
      '}\n\n';
    
    if (this.funs.length) {
      this.alloyCode[0] +=
        this.funs.join('\n\n') +
        '\n\n';
    }
  }

  writeRuns() {
    this.alloyCode[0] +=
      '-- Suggested run predicates\n' +
      'run singleWorld for 10 but 1 World, 7 Int\n' +
      'run linearWorlds for 10 but 3 World, 7 Int\n' +
      'run multipleWorlds for 10 but 4 World, 7 Int\n' +
      'run singleWorld for 20 but 1 World, 7 Int\n' +
      'run linearWorlds for 20 but 3 World, 7 Int\n' +
      'run multipleWorlds for 20 but 4 World, 7 Int\n';
  }

  writeWorldStructureModule() {
    this.alloyCode[1] +=
      'module world_structure[World]\n\n' +
      'some abstract sig TemporalWorld extends World {\n' +
      '        next: set TemporalWorld -- Immediate next moments\n' +
      '} {\n' +
      '        this not in this.^(@next) -- There are no temporal cicles\n' +
      '        lone ((@next).this) -- A world can be the immediate next momment of at maximum one world\n' +
      '}\n\n' +
      'one sig CurrentWorld extends TemporalWorld {} {\n' +
      '        next in FutureWorld\n' +
      '}\n\n' +
      'sig PastWorld extends TemporalWorld {} {\n' +
      '        next in (PastWorld + CounterfactualWorld + CurrentWorld)\n' +
      '        CurrentWorld in this.^@next -- All past worlds can reach the current moment\n' +
      '}\n\n' +
      'sig FutureWorld extends TemporalWorld {} {\n' +
      '        next in FutureWorld\n' +
      '        this in CurrentWorld.^@next -- All future worlds can be reached by the current moment\n' +
      '}\n\n' +
      'sig CounterfactualWorld extends TemporalWorld {} {\n' +
      '        next in CounterfactualWorld\n' +
      '        this in PastWorld.^@next -- All past worlds can reach the counterfactual moment\n' +
      '}\n\n' +
      '-- Elements cannot die and come to life later\n' +
      'pred continuous_existence [exists: World->univ] {\n' +
      '        all w : World, x: (@next.w).exists | (x not in w.exists) => (x not in (( w. ^next).exists))\n' +
      '}\n\n' +
      '-- All elements must exists in at least one world\n' +
      'pred elements_existence [elements: univ, exists: World->univ] {\n' +
      '        all x: elements | some w: World | x in w.exists\n' +
      '}\n\n' +
      '-- Run predicate for a single World\n' +
      'pred singleWorld {\n' +
      '        #World=1\n' +
      '}\n\n' +
      '-- Run predicate for linear Worlds (Past, Current, Future)\n' +
      'pred linearWorlds {\n' +
      '        #World=3 and #PastWorld=1 and #FutureWorld=1\n' +
      '}\n\n' +
      '-- Run predicate for multiple Worlds (Past, Counterfactual, Current, Future)\n' +
      'pred multipleWorlds {\n' +
      '        #World=4 and #PastWorld=1 and #CounterfactualWorld=1 and #FutureWorld=1\n' +
      '}\n';
  }

  writeOntologicalPropertiesModule() {
    this.alloyCode[2] +=
      'module ontological_properties[World]\n\n' +
      '-- This predicate states that a class is rigid\n' +
      'pred rigidity [Class: univ->univ, Nature: univ, exists: univ->univ] {\n' +
      '        all w1: World, p: univ | p in w1.exists and p in w1.Class implies\n' +
      '            all w2: World | w1!=w2 and p in w2.exists implies p in w2.Class\n' +
      '}\n\n' +
      '-- This predicate states that a class is anti-rigid\n' +
      'pred antirigidity [Class: set univ->univ, Nature: univ, exists: univ->univ] {\n' +
      '        all x: Nature | #World>=2 implies (some disj w1,w2: World |\n' +
      '            x in w1.exists and x in w1.Class and x in w2.exists and x not in w2.Class)\n' +
      '}\n\n' +
      '-- This predicate makes the source relation end immutable\n' +
      'pred immutable_source [Target: World->univ, rel: univ->univ->univ] {\n' +
      '        all w1: World, x: univ | x in w1.Target implies\n' +
      '            all w2: World | x in w2.Target implies (w1.rel).x=(w2.rel).x\n' +
      '}\n\n' +
      '-- This predicate makes the target relation end immutable\n' +
      'pred immutable_target [Source: World->univ, rel: univ->univ->univ] {\n' +
      '        all w1: World, x: univ | x in w1.Source implies\n' +
      '            all w2: World | x in w2.Source implies x.(w1.rel)=x.(w2.rel)\n' +
      '}\n';
  }

  transformClasses() {
    const classes = this.model.getAllClasses();

    for (const _class of classes) {
      transformClass(this, _class);
    }

    transformAdditionalClassConstraints(this);
    transformAdditionalDatatypeConstraints(this);

    return true;
  }
  /*
  This method retrieves all the classes present in the model and applies a transformation 
  to each of them using the transformClass() function. After that, it applies transformations to 
  additional class constraints and datatype constraints. Finally, it returns true.
  */

  transformGeneralizations() {
    let generalizations = this.model.getAllGeneralizations();


    for (const gen of generalizations) {
      transformGeneralization(this, gen);
    }
  }

  transformGeneralizationSets() {
    const generalizationSets = this.model.getAllGeneralizationSets();

    for (const genSet of generalizationSets) {
      transformGeneralizationSet(this, genSet);
    }
  }

  transformRelations() {
    const relations = this.model.getAllRelations();

    for (const relation of relations) {
      transformRelation(this, relation);
    }

    transformCharacterizationConstraint(this);
  }

  transformProperties() {
    const properties = this.model.getAllProperties();

    for (const property of properties) {
      transformProperty(this, property);
    }
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    this.transform();

    return {
      result: {
        mainModule: this.getAlloyCode()[0],
        worldStructureModule: this.getAlloyCode()[1],
        ontologicalPropertiesModule: this.getAlloyCode()[2]
      },
      issues: this.issues.length > 0 ? this.issues : undefined
    };
  }//method to check prerequisites for trasnforming a class
  /*
    After performing all the necessary transformations, the run method is called, which calls the 
    transform method and returns the resulting Alloy code in an object with three properties: mainModule, 
    worldStructureModule, and ontologicalPropertiesModule. The issues property is currently set to undefined, 
    but it could be used to report any issues or errors that occur during the transformation process.
  */
}
