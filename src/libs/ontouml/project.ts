import { Class } from '.';
import { ClassStereotype, OntologicalNature, PropertyStereotype, RelationStereotype } from '.';
import { Generalization } from '.';
import { GeneralizationSet } from '.';
import { Literal } from '.';
import { ModelElement } from '.';
import { ModelElementContainer } from '.';
import { Package } from '.';
import { Property } from '.';
import { Relation } from '.';
import { OntoumlElement } from '.';
import { OntoumlType } from '.';
import { Diagram } from '.';

export class Project extends OntoumlElement implements ModelElementContainer {
  model: Package;
  diagrams: Diagram[];

  constructor(base?: Partial<Project>) {
    super(OntoumlType.PROJECT_TYPE, base);

    this.model = base?.model || null;
    this.diagrams = base?.diagrams || [];
  }

  createModel(base?: Partial<Package>): Package {
    if (this.model) {
      throw new Error('Model already defined');
    }

    this.model = new Package({ ...base, container: null, project: this });
    return this.model;
  }

  setModel(pkg: Package): void {
    this.model = pkg;
    if (pkg != null) {
      this.model.setContainer(this);
    }
  }

  addDiagram(diagram: Diagram) {
    if (diagram === null) return;

    diagram.setContainer(this);
    this.diagrams.push(diagram);
  }

  addDiagrams(diagrams: Diagram[]) {
    if (diagrams === null) return;

    diagrams.forEach((d) => this.addDiagram(d));
  }

  setDiagrams(diagrams: Diagram[]) {
    this.diagrams = [];

    if (diagrams === null) return;

    this.addDiagrams(diagrams);
  }

  getContents(): OntoumlElement[] {
    let contents: OntoumlElement[] = [];

    if (this.model) {
      contents.push(this.model);
    }

    if (this.diagrams) {
      contents = [...contents, ...this.diagrams];
    }

    return contents;
  }

  getAllAttributes(): Property[] {
    return this.model.getAllAttributes();
  }

  getAllRelationEnds(): Property[] {
    return this.model.getAllRelationEnds();
  }

  getAllRelations(): Relation[] {
    return this.model.getAllRelations();
  }

  getAllGeneralizations(): Generalization[] {
    return this.model.getAllGeneralizations();
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    return this.model.getAllGeneralizationSets();
  }

  getAllPackages(): Package[] {
    return this.getAllContents().filter((e) => e instanceof Package) as Package[];
  }

  getAllClasses(): Class[] {
    return this.model.getAllClasses();
  }

  getAllEnumerations(): Class[] {
    return this.model.getAllEnumerations();
  }

  getAllLiterals(): Literal[] {
    return this.model.getAllLiterals();
  }

  getAllModelElements(): ModelElement[] {
    return this.getAllContents().filter((e) => e instanceof ModelElement) as ModelElement[];
  }

  getAllContentsByType(type: OntoumlType | OntoumlType[]): OntoumlElement[] {
    return this.model.getAllContentsByType(type);
  }

  getAllAttributesByStereotype(stereotype: PropertyStereotype | PropertyStereotype[]): Property[] {
    return this.model.getAllAttributesByStereotype(stereotype);
  }

  getAllClassesByStereotype(stereotype: ClassStereotype | ClassStereotype[]): Class[] {
    return this.model.getAllClassesByStereotype(stereotype);
  }

  getAllRelationsByStereotype(stereotype: RelationStereotype | RelationStereotype[]): Relation[] {
    return this.model.getAllRelationsByStereotype(stereotype);
  }

  getAllClassesWithRestrictedToContainedIn(nature: OntologicalNature | OntologicalNature[]): Class[] {
    return this.model.getAllClassesWithRestrictedToContainedIn(nature);
  }

  getClassesWithTypeStereotype(): Class[] {
    return this.model.getClassesWithTypeStereotype();
  }

  getClassesWithHistoricalRoleStereotype(): Class[] {
    return this.model.getClassesWithHistoricalRoleStereotype();
  }

  getClassesWithHistoricalRoleMixinStereotype(): Class[] {
    return this.model.getClassesWithHistoricalRoleMixinStereotype();
  }

  getClassesWithEventStereotype(): Class[] {
    return this.model.getClassesWithEventStereotype();
  }

  getClassesWithSituationStereotype(): Class[] {
    return this.model.getClassesWithSituationStereotype();
  }

  getClassesWithCategoryStereotype(): Class[] {
    return this.model.getClassesWithCategoryStereotype();
  }

  getClassesWithMixinStereotype(): Class[] {
    return this.model.getClassesWithMixinStereotype();
  }

  getClassesWithRoleMixinStereotype(): Class[] {
    return this.model.getClassesWithRoleMixinStereotype();
  }

  getClassesWithPhaseMixinStereotype(): Class[] {
    return this.model.getClassesWithPhaseMixinStereotype();
  }

  getClassesWithKindStereotype(): Class[] {
    return this.model.getClassesWithKindStereotype();
  }

  getClassesWithCollectiveStereotype(): Class[] {
    return this.model.getClassesWithCollectiveStereotype();
  }

  getClassesWithQuantityStereotype(): Class[] {
    return this.model.getClassesWithQuantityStereotype();
  }

  getClassesWithRelatorStereotype(): Class[] {
    return this.model.getClassesWithRelatorStereotype();
  }

  getClassesWithQualityStereotype(): Class[] {
    return this.model.getClassesWithQualityStereotype();
  }

  getClassesWithModeStereotype(): Class[] {
    return this.model.getClassesWithModeStereotype();
  }

  getClassesWithSubkindStereotype(): Class[] {
    return this.model.getClassesWithSubkindStereotype();
  }

  getClassesWithRoleStereotype(): Class[] {
    return this.model.getClassesWithRoleStereotype();
  }

  getClassesWithPhaseStereotype(): Class[] {
    return this.model.getClassesWithPhaseStereotype();
  }

  getClassesWithEnumerationStereotype(): Class[] {
    return this.model.getClassesWithEnumerationStereotype();
  }

  getClassesWithDatatypeStereotype(): Class[] {
    return this.model.getClassesWithDatatypeStereotype();
  }

  getClassesWithAbstractStereotype(): Class[] {
    return this.model.getClassesWithAbstractStereotype();
  }

  getClassesRestrictedToFunctionalComplex(): Class[] {
    return this.model.getClassesRestrictedToFunctionalComplex();
  }

  getClassesRestrictedToCollective(): Class[] {
    return this.model.getClassesRestrictedToCollective();
  }

  getClassesRestrictedToQuantity(): Class[] {
    return this.model.getClassesRestrictedToQuantity();
  }

  getClassesRestrictedToMode(): Class[] {
    return this.model.getClassesRestrictedToMode();
  }

  getClassesRestrictedToIntrinsicMode(): Class[] {
    return this.model.getClassesRestrictedToIntrinsicMode();
  }

  getClassesRestrictedToExtrinsicMode(): Class[] {
    return this.model.getClassesRestrictedToExtrinsicMode();
  }

  getClassesRestrictedToQuality(): Class[] {
    return this.model.getClassesRestrictedToQuality();
  }

  getClassesRestrictedToRelator(): Class[] {
    return this.model.getClassesRestrictedToRelator();
  }

  lock(): void {
    throw new Error('Unimplemented method');
  }

  unlock(): void {
    throw new Error('Unimplemented method');
  }

  getClassesByNature(): Class[] {
    throw new Error('Method unimplemented!');
  }

  toJSON(): any {
    const projectSerialization = {
      model: null,
      diagrams: null
    };

    Object.assign(projectSerialization, super.toJSON());

    return projectSerialization;
  }

  toString(): string {
    let object = { id: this.id, type: this.type, name: this.getName() };
    return JSON.stringify(object, null, 2);
  }
}
