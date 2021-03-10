import {Class, GeneralizationSet, Generalization, Diagram, Project, ClassStereotype, ModelElement, Relation} from '@libs/ontouml';
import {Service} from '@libs/service';
import {ServiceIssue} from '@libs/service_issue';
import {Viewpoint} from './viewpoint';

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
        .map((viewpoint) => viewpoint.createDiagram(this.project.model));
  }

  extractViewpoint(id:string, pattern: string):Viewpoint {
    let viewpoint = new Viewpoint('Viewpoint of '+ pattern);

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

  kindView() : Viewpoint {
    const viewpoint = new Viewpoint('Kind View');

    const classes = this.project.getAllClassesByStereotype(ClassStereotype.KIND);

    viewpoint.addClasses(classes);
    viewpoint.addRelations(this.getRelationsBetweenClasses(classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  subKindView() :Viewpoint {
    const viewpoint = new Viewpoint('SubKind View');

    const classes = this.project.getAllClassesByStereotype(ClassStereotype.SUBKIND);

    let generals = [];
    for (let i = 0; i < classes.length; i++) {
      generals = generals.concat(classes[i].getAncestors().filter((cl) => cl.hasSortalStereotype()));
    }

    viewpoint.addClasses(classes);
    viewpoint.addClasses(generals);

    viewpoint.removeDuplicates();

    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  roleView() :Viewpoint {
    const viewpoint = new Viewpoint('Role View');

    const classes = this.project.getAllClassesByStereotype(ClassStereotype.ROLE);

    let generals = [];
    for (let i = 0; i < classes.length; i++) {
      generals = generals.concat(classes[i].getAncestors().filter((cl) => cl.hasSortalStereotype()));
    }

    viewpoint.addClasses(classes);
    viewpoint.addClasses(generals);

    viewpoint.removeDuplicates();

    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  phaseView() :Viewpoint {
    const viewpoint = new Viewpoint('Phase View');

    const classes = this.project.getAllClassesByStereotype(ClassStereotype.PHASE);

    let generals = [];
    for (let i = 0; i < classes.length; i++) {
      generals = generals.concat(classes[i].getAncestors().filter((cl) => cl.hasSortalStereotype()));
    }

    viewpoint.addClasses(classes);
    viewpoint.addClasses(generals);

    viewpoint.removeDuplicates();

    viewpoint.addRelations(this.getRelationsBetweenClasses(viewpoint.classes));
    viewpoint.addGeneralizations(this.getGeneralizationsBetweenClasses(viewpoint.classes));

    viewpoint.removeDuplicates();

    return viewpoint;
  }

  relatorView = () => {
    const viewpoint = new Viewpoint('Relator View');

    let classes = this.project.getAllClassesByStereotype(ClassStereotype.RELATOR);

    const relacoes = this.project.getAllRelations();
    let mediacoes = [];

    for (let j = 0; j < classes.length; j++) {
      for (let i = 0; i < relacoes.length; i++) {
        if ((this.isClassInRelation(classes[j], relacoes[i])) && (relacoes[i].hasMediationStereotype())) {
          mediacoes = mediacoes.concat(relacoes[i]);
        }
      }
    }

    for (let i = 0; i < mediacoes.length; i++) {
      if (!mediacoes[i].getSourceClass().hasRelatorStereotype()) {
        classes = classes.concat(mediacoes[i].getSourceClass());
      } else {
        if (!mediacoes[i].getTargetClass().hasRelatorStereotype()) {
          classes = classes.concat(mediacoes[i].getTargetClass());
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

  nonSortalView() :Viewpoint {
    const viewpoint = new Viewpoint('Non Sortal View');

    let classes = this.project.getAllClassesByStereotype(ClassStereotype.ROLE_MIXIN);

    classes = classes.concat(this.project.getAllClassesByStereotype(ClassStereotype.MIXIN));
    classes = classes.concat(this.project.getAllClassesByStereotype(ClassStereotype.CATEGORY));
    classes = classes.concat(this.project.getAllClassesByStereotype(ClassStereotype.PHASE_MIXIN));

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

  modeView() :Viewpoint {
    const viewpoint = new Viewpoint('Mode View');

    let classes = this.project.getAllClassesByStereotype(ClassStereotype.MODE);

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
   * Definicao da funcao que ira checar se uma determinada classe participa da relacoa
   * @param classe A classe a ser verificada na relacao
   * @param relacao A relacao que pode possuir a classe passada
   */
  isClassInRelation(classe:Class, relacao:Relation) : boolean {
    if (classe == relacao.getSourceClass() || classe == relacao.getTargetClass()) {
      return true;
    } else return false;
  }

  /**
   * Definicao da funcao que ira verificar se no origem de um determinado relacioanamento possui alguma classe da lista passada
   *
   * @param classes Lista de classes para verificar se alguma delas está no Origem da relacao
   * @param relacao Relacao que ser a verificada se no seu origem contem alguma das classes passada
   */
  hasClassInSourceOfRelation(classes : Class[], relacao : Relation) : boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == relacao.getSourceClass()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Definicao da funcao que ira verificar se no destino de um determinado relacioanamento possui alguma classe da lista passada
   *
   * @param classes Lista de classes para verificar se alguma delas está no Destino da relacao
   * @param relacao Relacao que ser a verificada se no seu destino contem alguma das classes passada
   */
  hasClassInTargetOfRelation(classes : Class[], relacao : Relation) : boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == relacao.getTargetClass()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Definicao da funcao que ira verificar se um determinado relacionamento tem as suas partes (origem e destino) na lista de classes passadas
   * Esta funcao e utilizada para recuperar as relacoes existentes entre elementos contidos na lista de classes
   *
   * @param classes Lista de classes para verificar quais relações existem entre elas
   * @param relacao A relacao que ira verificar se na origem e no destino contem classes da lista passada
   */
  relationWithSourceAndTarget(classes : Class[], relacao : Relation) : boolean {
    if (this.hasClassInSourceOfRelation(classes, relacao) && (this.hasClassInTargetOfRelation(classes, relacao))) {
      return true;
    } else {
      return false;
    }
  }

  /**
 * Definicao da funcao que obter a lista de relacoes entre as classes passadas
 *
 * @param classes Lista de classes utilizada para obter as relacoes entre elas
 */
  getRelationsBetweenClasses(classes: Class[]) : Relation[] {
    const relacoes = this.project.getAllRelations();

    let relacoesRetorno = [];

    for (let i = 0; i < relacoes.length; i++) {
      if (this.relationWithSourceAndTarget(classes, relacoes[i])) {
        relacoesRetorno = relacoesRetorno.concat(relacoes[i]);
      }
    }

    return relacoesRetorno;
  }

  /**
   * Definicao da funcao que ira verificar se no general de uma determinada generalizacao possui alguma classe da lista passada
   *
   * @param classes Lista de classes para verificar se alguma delas está no General da generelizacao
   * @param generalizacao Generalizacao que ser a verificada se no seu general contem alguma das classes passada
   */
  hasClassInGeneralOfGeneralization(classes:Class[], generalizacao:Generalization) : boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == generalizacao.general) {
        return true;
      }
    }
    return false;
  }

  /**
 * Definicao da funcao que ira verificar se no specific de uma determinada generalizacao possui alguma classe da lista passada
 *
 * @param classes Lista de classes para verificar se alguma delas está no Specific da generelizacao
 * @param generalizacao Generalizacao que ser a verificada se no seu specific contem alguma das classes passada
 */
  hasClassInSpecificOfGeneralization(classes:Class[], generalizacao:Generalization) : boolean {
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == generalizacao.specific) {
        return true;
      }
    }
    return false;
  }

  /**
 * Definicao da funcao que ira verificar se uma determinada generalizacao tem as suas partes (general e specific) na lista de classes passadas
 * Esta funcao e utilizada para recuperar as generalizacoes existentes entre elementos contidos na lista de classes
 *
 * @param classes Lista de classes para verificar quais generalizacoes existem entre elas
 * @param generalizacao A generalizacao que ira verificar se no pai e no filho contem classes da lista passada
 */
  generalizationWithGeneralAndSpecific(classes:Class[], generalizacao:Generalization) :boolean {
    if (this.hasClassInGeneralOfGeneralization(classes, generalizacao) && (this.hasClassInSpecificOfGeneralization(classes, generalizacao))) {
      return true;
    } else {
      return false;
    }
  }

  /**
* Definicao da funcao que obter a lista de generalizacoes entre as classes passadas
*
* @param classes Lista de classes utilizada para obter as generalizacoes entre elas
*/
  getGeneralizationsBetweenClasses(classes:Class[]) : Generalization[] {
    const generalizacoes = this.project.getAllGeneralizations();

    let generalizacoesRetorno = [];

    for (let i = 0; i < generalizacoes.length; i++) {
      if (this.generalizationWithGeneralAndSpecific(classes, generalizacoes[i])) {
        generalizacoesRetorno = generalizacoesRetorno.concat(generalizacoes[i]);
      }
    }

    return generalizacoesRetorno;
  }


  static getNonSortalLine(nonSortal: Class): Class[] {
    return this.traverseNonSortalLine(nonSortal, []);
  }

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
