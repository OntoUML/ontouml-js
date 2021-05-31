import { Class, GeneralizationSet, Generalization, Diagram, Project, ClassStereotype, ModelElement, Relation } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { Module } from '.';

/**
 * Class that implements the pattern-based model clustering strategy proposed in:
 *
 * Figueiredo, G., Duchardt, A., Hedblom, M.M. and Guizzardi, G., 2018, May. Breaking into pieces:
 * An ontological approach to conceptual model complexity management.
 * In 2018 12th International Conference on Research Challenges in Information Science (RCIS) (pp. 1-10). IEEE.
 * https://ieeexplore.ieee.org/iel7/8401323/8406639/08406642.pdf
 *
 * @author Guylerme Figueiredo
 */


export class ViewpointExtractor implements Service {
  project: Project;

  constructor(project: Project, _options?: any) {
    this.project = project;

    if (_options) {
      console.log('Options ignored: this service does not support options');
    }
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    const generatedDiagrams = this.buildAll();
    this.project.addDiagrams(generatedDiagrams);

    return {
      result: this.project,
      issues: null,
    };
  }

  buildAll(): Diagram[] {
    const allPatterns = [ClassStereotype.KIND, ClassStereotype.SUBKIND, ClassStereotype.ROLE, ClassStereotype.PHASE, ClassStereotype.RELATOR, ClassStereotype.MODE, 'NON_SORTAL'];
    return allPatterns.map((pattern, index) => this.extractViewpoint(String(index), pattern))
      .map((module) => module.createDiagram(this.project.model));
  }

  /**
   * This methor will run the pattern viewpoint extrator.
   * 
   * @param id The name of viewpoint extractor 
   * @param pattern The viewpoint extractor approach based on OntoUML Patterns
   * @returns A viewpoint based on a pattern choosen
   */
  extractViewpoint(id: string, pattern: string): Module {
    let viewpoint = new Module('Viewpoint of ' + pattern);

    switch (pattern) {
      case ClassStereotype.KIND: viewpoint = this.kindView();
        break;
      case ClassStereotype.SUBKIND: viewpoint = this.subKindView();
        break;
      case ClassStereotype.ROLE: viewpoint = this.roleView();
        break;
      case ClassStereotype.PHASE: viewpoint = this.phaseView();
        break;
      case ClassStereotype.RELATOR: viewpoint = this.relatorView();
        break;
      case ClassStereotype.MODE: viewpoint = this.modeView();
        break;
      case 'NON_SORTAL': viewpoint = this.nonSortalView();
        break;
    }


    return viewpoint;
  }

  /**
   * This method filter all Kinds and related relations ando group them in a view
   * 
   * @returns A viewpoint extracted using the Kind Pattern
   */
  kindView(): Module {
    const viewpoint = new Module('Kind View');

    const classes = this.project.getClassesWithKindStereotype();

    viewpoint.addClasses(classes);

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  /**
     * This method filter all Subkinds, respective sortal ancestors  and related relations and group them in a view
     * 
     * @returns A viewpoint extracted using the Subkind Pattern
     */
  subKindView(): Module {
    const viewpoint = new Module('SubKind View');

    /**Step 1 Get all Subkinds in model
     * 
     * Step 2 Get all sortal ancestors 
     * 
     * Step 3 Get all relations between all classes (subkinds and sortal ancestors)
     * 
     * Step 4 Get all generalizations between all classes (subkinds and sortal ancestors)
     */

    const classes = this.project.getClassesWithSubkindStereotype();

    let generals = [];
    for (let i = 0; i < classes.length; i++) {
      generals = generals.concat(classes[i].getSortalAncestors());
    }

    viewpoint.addClasses(classes);
    viewpoint.addClasses(generals);

    viewpoint.removeDuplicates();

    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }


  /**
     * This method filter all Roles, respective sortal ancestors  and related relations and group them in a view
     * 
     * @returns A viewpoint extracted using the Role Pattern
     */
  roleView(): Module {
    const viewpoint = new Module('Role View');

    /**Step 1 Get all Roles in model
     * 
     * Step 2 Get all sortal ancestors 
     * 
     * Step 3 Get all relations between all classes (roles and sortal ancestors)
     * 
     * Step 4 Get all generalizations between all classes (roles and sortal ancestors)
     */

    const classes = this.project.getClassesWithRoleStereotype();

    let generals = [];
    for (let i = 0; i < classes.length; i++) {
      generals = generals.concat(classes[i].getSortalAncestors());
    }

    viewpoint.addClasses(classes);
    viewpoint.addClasses(generals);

    viewpoint.removeDuplicates();

    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  /**
     * This method filter all Phases, respective sortal ancestors  and related relations and group them in a view
     * 
     * @returns A viewpoint extracted using the Phase Pattern
     */
  phaseView(): Module {
    const viewpoint = new Module('Phase View');


    /**Step 1 Get all Phases in model
     * 
     * Step 2 Get all sortal ancestors 
     * 
     * Step 3 Get all relations between all classes (phases and sortal ancestors)
     * 
     * Step 4 Get all generalizations between all classes (phases and sortal ancestors)
     */
    const classes = this.project.getClassesWithPhaseStereotype();

    let generals = [];
    for (let i = 0; i < classes.length; i++) {
      generals = generals.concat(classes[i].getSortalAncestors());
    }

    viewpoint.addClasses(classes);
    viewpoint.addClasses(generals);

    viewpoint.removeDuplicates();

    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  /**
     * This method filter all Relators, respective direct conectect clases by mediator relation, their sortal ancestors  
     * and related relations and group them in a view
     * 
     * @returns A viewpoint extracted using the Relator Pattern
     */
  relatorView = () => {
    const viewpoint = new Module('Relator View');


    /**Step 1 Get all Relators in model
     * 
     * Step 2 Get all classes conected by mediation relation 
     * 
     * Step 3 Get all sortal ancestors 
     * 
     * Step 4 Get all relations between all classes 
     * 
     * Step 5 Get all generalizations between all classes 
     */
    let classes = this.project.getClassesWithRelatorStereotype();

    let mediations = [];

    for (let j = 0; j < classes.length; j++) {
      mediations = mediations.concat(this.project.getMediations(classes[j]));
    }

    for (let i = 0; i < mediations.length; i++) {
      if (!mediations[i].getSourceClass().hasRelatorStereotype()) {
        classes = classes.concat(mediations[i].getSourceClass());
      } else {
        if (!mediations[i].getTargetClass().hasRelatorStereotype()) {
          classes = classes.concat(mediations[i].getTargetClass());
        }
      }
    }

    viewpoint.addClasses(classes);

    viewpoint.removeDuplicates();


    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  /**
     * This method filter all Non-Sortals, their descendants, then the decendants sortal ancestors  and related 
     * relations and group them in a view
     * 
     * @returns A viewpoint extracted using the Non-Sortal Pattern
     */
  nonSortalView(): Module {
    const viewpoint = new Module('Non Sortal View');

    /**Step 1 Get all Non-Sortals in model
     * 
     * Step 2 Get all non-sortals decendants 
     * 
     * Step 3 Get all decendants sortal ancestors 
     * 
     * Step 4 Get all relations between all classes 
     * 
     */
    let classes = this.project.getClassesWithRoleMixinStereotype();

    classes = classes.concat(this.project.getClassesWithMixinStereotype());
    classes = classes.concat(this.project.getClassesWithCategoryStereotype());
    classes = classes.concat(this.project.getClassesWithPhaseMixinStereotype());

    let decendentes = [];
    for (let i = 0; i < classes.length; i++) {
      decendentes = decendentes.concat(classes[i].getDescendants());
    }

    let generals = [];
    for (let i = 0; i < decendentes.length; i++) {
      generals = generals.concat(decendentes[i].getAncestors());
    }

    classes = classes.concat(generals);

    classes = classes.concat(decendentes);

    viewpoint.addClasses(classes);
    viewpoint.removeDuplicates();


    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  /**
     * This method filter all Modes, their descendants, then the decendants sortal ancestors  and related relations and group them in a view
     * 
     * @returns A viewpoint extracted using the Mode Pattern
     */
  modeView(): Module {
    const viewpoint = new Module('Mode View');

    /**Step 1 Get all Modes in model
      * 
      * Step 2 Get all modes decendants 
      * 
      * Step 3 Get all decendants sortal ancestors 
      * 
      * Step 4 Get all relations between all classes
      * 
      */
    let classes = this.project.getClassesWithModeStereotype();

    let decendentes = [];
    for (let i = 0; i < classes.length; i++) {
      decendentes = decendentes.concat(classes[i].getDescendants());
    }

    let generals = [];
    for (let i = 0; i < decendentes.length; i++) {
      generals = generals.concat(decendentes[i].getAncestors());
    }

    classes = classes.concat(generals);

    classes = classes.concat(decendentes);

    viewpoint.addClasses(classes);

    viewpoint.removeDuplicates();


    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  

  /**
   * This method will verify if any class is in Source of relation
   *
   * @param classes List of classes to be verified if any of them is in the Source of relation
   * @param relation The relation where the class may be participating
   */
  hasClassInSourceOfRelation(classes: Class[], relation: Relation): boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == relation.getSourceClass()) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method will verify if any class is in Target of relation
   *
   * @param classes List of classes to be verified if any of them is in the Target of relation
   * @param relation The relation where the class may be participating
   */
  hasClassInTargetOfRelation(classes: Class[], relation: Relation): boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == relation.getTargetClass()) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method will verify if a relation has in its parts (source and target) any of class in the list
   *
   * @param classes List of classes to be verified if any of them is in the Target of relation
   * @param relation The relation where the class may be participating
   */
  relationWithSourceAndTarget(classes: Class[], relation: Relation): boolean {
    if (this.hasClassInSourceOfRelation(classes, relation) && (this.hasClassInTargetOfRelation(classes, relation))) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method get the relations between the classes
   *
   * @param classes List of classes
   */
  getRelationsBetweenClasses(classes: Class[]): Relation[] {
    const relations = this.project.getAllRelations();

    let returnRelations = [];

    for (let i = 0; i < relations.length; i++) {
      if (this.relationWithSourceAndTarget(classes, relations[i])) {
        returnRelations = returnRelations.concat(relations[i]);
      }
    }

    return returnRelations;
  }

  /**
   * This method will verify if any class in the list is the general of generalization
   *
   * @param classes List of classes to be verified
   * @param generalizacao Generalization to check if any class is its general
   */
  hasClassInGeneralOfGeneralization(classes: Class[], generalization: Generalization): boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == generalization.general) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method will verify is any class in the list is the specific of generalization
   *
   * @param classes List of classes to be verified
   * @param generalizacao Generalization to check if any class is its specific
   */
  hasClassInSpecificOfGeneralization(classes: Class[], generalization: Generalization): boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == generalization.specific) {
        return true;
      }
    }
    return false;
  }

  /**
   * This method will verify is any class in the list is the general or the specific of generalization
   *
   * @param classes List of classes to be verified
   * @param generalizacao Generalization to check if any class is its specific or its general
   */
  generalizationWithGeneralAndSpecific(classes: Class[], generalization: Generalization): boolean {
    if (this.hasClassInGeneralOfGeneralization(classes, generalization) && (this.hasClassInSpecificOfGeneralization(classes, generalization))) {
      return true;
    } else {
      return false;
    }
  }

  /**
    * This method gets the list of generalizations between classes
    *
    * @param classes List of classes to obtain the generalizations between then
    */
  getGeneralizationsBetweenClasses(classes: Class[]): Generalization[] {
    const generalizations = this.project.getAllGeneralizations();

    let returnGeneralizations = [];

    for (let i = 0; i < generalizations.length; i++) {
      if (this.generalizationWithGeneralAndSpecific(classes, generalizations[i])) {
        returnGeneralizations = returnGeneralizations.concat(generalizations[i]);
      }
    }

    return returnGeneralizations;
  }

  /**
    * This method gets the classes in specific line of a NonSortal
    *
    * @param classes The non-sortal to get its specifics
    */
  static getNonSortalLine(nonSortal: Class): Class[] {
    return this.traverseNonSortalLine(nonSortal, []);
  }

  /**
    * This method gets the classes in specific line of a NonSortal
    *
    * @param classes The non-sortal to get its specifics
    */
  private static traverseNonSortalLine(nonSortal: Class, path: Class[]): Class[] {
    nonSortal.getChildren().forEach((child) => {
      if (!(child instanceof Class) || !child.stereotype) return;

      if (!path.includes(child)) path.push(child);

      if (child.hasNonSortalStereotype()) path = this.traverseNonSortalLine(child, path);
    });

    return path;
  }

  
  getGeneralizationSetsFrom(referenceGens: Generalization[]): GeneralizationSet[] {
    const gsInvolvesAll = this.project.getGeneralizationSetsInvolvingAll(referenceGens);
    const partitionInvolvesAny = this.project.getGeneralizationSetsInvolvingAny(referenceGens).filter((gs) => gs.isPhasePartition());

    return [...gsInvolvesAll, ...partitionInvolvesAny];
  }
}
