import { Class } from "./model/class";
import { Generalization } from "./model/generalization";
import { GeneralizationSet } from "./model/generalization_set";
import { Literal } from "./model/literal";
import { ModelElement } from "./model/model_element";
import { OntologicalNature } from "./model/natures";
import { Package } from "./model/package";
import { Property } from "./model/property";
import { Relation } from "./model/relation";
import { ClassStereotype, PropertyStereotype, RelationStereotype, stereotypeUtils } from "./model/stereotypes";
import { OntoumlElement } from "./ontouml_element";
import { Project } from "./project";
import { utils } from "./utils";

export class Finder {
   project: Project;

   constructor(project: Project) {
      this.project = project;
   }

   getElementById(id: String): OntoumlElement {
      return this.project.getAllContents().filter(e => e.id === id)?.[0];
    }
  
    getClassById(id: String): Class {
      return this.getClasses().filter(e => e.id === id)?.[0];
    }
  
    getRelationById(id: String): Relation {
      return this.getRelations().filter(e => e.id === id)?.[0];
    }
  
    getPropertyById(id: String): Property {
      return this.getProperties().filter(e => e.id === id)?.[0];
    }
  
    getGeneralizationById(id: String): Generalization {
      return this.getGeneralizations().filter(e => e.id === id)?.[0];
    }
  
    getGeneralizationSetById(id: String): GeneralizationSet {
      return this.getGeneralizationSets().filter(e => e.id === id)?.[0];
    }
  
    getPackageById(id: String): Package {
      return this.getPackages().filter(e => e.id === id)?.[0];
    }
  
    /** 
     * Returns all association ends and attributes contained in the package.
    */
    getProperties(): Property[] {
      return this.project.getAllContents().filter(e => e instanceof Property) as Property[];
    }
  
    getAttributes(): Property[] {
      return this.getProperties().filter(p => p.isAttribute());
    }
  
    getRelationEnds(): Property[] {
      return this.getProperties().filter(p => p.isRelationEnd());
    }
  
    getRelations(): Relation[] {
      return this.project.getAllContents().filter(e => e instanceof Relation) as Relation[];
    }
  
    getBinaryRelations(): Relation[] {
      return this.getRelations().filter(e => e.isBinary());
    }
  
    getNaryRelations(): Relation[] {
      return this.getRelations().filter(e => e.isNary());
    }
  
    getGeneralizations(): Generalization[] {
      return this.project.getAllContents().filter(e => e instanceof Generalization) as Generalization[];
    }
  
    getGeneralizationSets(): GeneralizationSet[] {
      return this.project.getAllContents().filter(e => e instanceof GeneralizationSet) as GeneralizationSet[];
    }
  
    /**
     * 
     * @returns all packages contained by the package. Does not return itself.
     */
    getPackages(): Package[] {
      return this.project.getAllContents().filter(e => e instanceof Package) as Package[];
    }
  
    getClasses(): Class[] {
      return this.project.getAllContents().filter(e => e instanceof Class) as Class[];
    }
  
    /**
     * 
     * @returns the literals of all enumerations contained in the package.
     */
    getLiterals(): Literal[] {
      return this.project.getAllContents().filter(e => e instanceof Literal) as Literal[];
    }
  
    getModelElements(): ModelElement[] {
      return this.project.getAllContents().filter(e => e instanceof ModelElement) as ModelElement[];
    }
  
    // getContentsByType(type: OntoumlType | OntoumlType[]): OntoumlElement[] {
    //   const types = utils.arrayFrom(type);
    //   return this.project.getAllContents().filter(e => types.includes(e.type));
    // }
  
    getAttributesByStereotype(stereotype: PropertyStereotype | PropertyStereotype[]): Property[] {
      const stereotypes = utils.arrayFrom(stereotype);
      
      return this.getAttributes()
                 .filter(a => a.hasStereotype())
                 .filter(a => stereotypes.includes(a.stereotype!));
    }
  
    getClassesByStereotype(stereotype: ClassStereotype | ClassStereotype[]): Class[] {
      const stereotypes = utils.arrayFrom(stereotype);
  
      return this.getClasses()
                 .filter(c => c.hasStereotype())
                 .filter(c => stereotypes.includes(c.stereotype!));
    }
  
    getRelationsByStereotype(stereotype: RelationStereotype | RelationStereotype[]): Relation[] {
      const stereotypes = utils.arrayFrom(stereotype);
  
      return this.getRelations()
                 .filter(r => r.hasStereotype())
                 .filter(r => stereotypes.includes(r.stereotype!));
    }
  
    getClassesThatAllowOnly(nature: OntologicalNature | OntologicalNature[]): Class[] {
      const natures = utils.arrayFrom(nature);
  
      return this.getClasses()
                 .filter(c => c.hasStereotype())
                 .filter(c => c.allowsOnly(natures));
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «type».
     */
    getTypes(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.TYPE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «historicalRoles».
     */
    getHistoricalRoles(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.HISTORICAL_ROLE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «historicalRoleMixin».
     */
    getHistoricalRoleMixins(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.HISTORICAL_ROLE_MIXIN);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «event».
     */
    getEvents(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.EVENT);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «situation».
     */
    getSituations(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.SITUATION);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «category».
     */
    getCategories(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.CATEGORY);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «mixin».
     */
    getMixins(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.MIXIN);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «roleMixin».
     */
    getRoleMixins(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.ROLE_MIXIN);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «phaseMixin».
     */
    getPhaseMixins(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.PHASE_MIXIN);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «kind».
     */
    getKinds(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.KIND);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «collective».
     */
    getCollectives(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.COLLECTIVE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «quantity».
     */
    getQuantities(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.QUANTITY);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «relator».
     */
    getRelators(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.RELATOR);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «quality».
     */
    getQualities(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.QUALITY);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «mode».
     */
    getModes(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.MODE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «subkind».
     */
    getSubkinds(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.SUBKIND);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «role».
     */
    getRoles(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.ROLE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «phase».
     */
    getPhases(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.PHASE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «enumeration».
     */
    getEnumerations(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.ENUMERATION);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «datatype».
     */
    getDatatypes(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.DATATYPE);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «abstract».
     */
    getAbstracts(): Class[] {
      return this.getClassesByStereotype(ClassStereotype.ABSTRACT);
    }
  
   
    getSortals(): Class[] {
      return this.getClassesByStereotype(stereotypeUtils.SortalStereotypes);
    }
  
    /**
     * 
     * @returns all classes contained in the package that are stereotyped as «mixin», «phaseMixin», «roleMixin», «historicalRoleMixin», or «category».
     */
    getNonSortals(): Class[] {
      return this.getClassesByStereotype(stereotypeUtils.NonSortalStereotypes);
    }
  
    getAntiRigidTypes(): Class[] {
      return this.getClassesByStereotype(stereotypeUtils.AntiRigidStereotypes);
    }
  
    getSemiRigidTypes(): Class[] {
      return this.getClassesByStereotype(stereotypeUtils.SemiRigidStereotypes);
    }
  
    getRigidTypes(): Class[] {
      return this.getClassesByStereotype(stereotypeUtils.RigidStereotypes);
    }
  
    /**
     * 
     * @returns all classes that can only be instantiated by functional complexes. That is, classes whose fields `restrictedTo` equal to {@link OntologicalNature.functional_complex}.
     */
    getFunctionalComplexTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.functional_complex);
    }
  
    getCollectiveTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.collective);
    }
  
    getQuantityTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.quantity);
    }
  
    getModeTypes(): Class[] {
      return this.getClassesThatAllowOnly([OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode]);
    }
  
    getInstricModeTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.intrinsic_mode);
    }
  
    getExtrinsicModeTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.extrinsic_mode);
    }
  
    getQualityTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.quality);
    }
  
    getRelatorTypes(): Class[] {
      return this.getClassesThatAllowOnly(OntologicalNature.relator);
    }
    
    getBringsAboutRelation(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.BRINGS_ABOUT);
    }
  
    getCharacterizations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.CHARACTERIZATION);
    }
  
    getComparatives(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.COMPARATIVE);
    }
  
    getComponentOfRelations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.COMPONENT_OF);
    }
  
    getCreations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.CREATION);
    }
  
    getDerivations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.DERIVATION);
    }
  
    getExternalDependencies(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.EXTERNAL_DEPENDENCE);
    }
  
    getHistoricalDependencies(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.HISTORICAL_DEPENDENCE);
    }
  
    getInstantiations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.INSTANTIATION);
    }
  
    getManifestations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.MANIFESTATION);
    }
  
    getMaterialRelations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.MATERIAL);
    }
  
    getMediations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.MEDIATION);
    }
  
    getMemberOfs(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.MEMBER_OF);
    }
  
    getParticipations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.PARTICIPATION);
    }
  
    getParticipationals(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.PARTICIPATIONAL);
    }
  
    getSubCollectionOfs(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.SUBCOLLECTION_OF);
    }
  
    getSubQuantityOfs(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.SUBQUANTITY_OF);
    }
  
    getTerminations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.TERMINATION);
    }
  
    getTriggersRelations(): Relation[] {
      return this.getRelationsByStereotype(RelationStereotype.TRIGGERS);
    }


}