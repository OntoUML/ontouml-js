export declare type Stereotype = ClassStereotype | RelationStereotype | PropertyStereotype;
export declare enum ClassStereotype {
    TYPE = "type",
    HISTORICAL_ROLE = "historicalRole",
    HISTORICAL_ROLE_MIXIN = "historicalRoleMixin",
    EVENT = "event",
    SITUATION = "situation",
    CATEGORY = "category",
    MIXIN = "mixin",
    ROLE_MIXIN = "roleMixin",
    PHASE_MIXIN = "phaseMixin",
    KIND = "kind",
    COLLECTIVE = "collective",
    QUANTITY = "quantity",
    RELATOR = "relator",
    QUALITY = "quality",
    MODE = "mode",
    SUBKIND = "subkind",
    ROLE = "role",
    PHASE = "phase",
    ENUMERATION = "enumeration",
    DATATYPE = "datatype",
    ABSTRACT = "abstract"
}
export declare enum RelationStereotype {
    MATERIAL = "material",
    DERIVATION = "derivation",
    COMPARATIVE = "comparative",
    MEDIATION = "mediation",
    CHARACTERIZATION = "characterization",
    EXTERNAL_DEPENDENCE = "externalDependence",
    COMPONENT_OF = "componentOf",
    MEMBER_OF = "memberOf",
    SUBCOLLECTION_OF = "subCollectionOf",
    SUBQUANTITY_OF = "subQuantityOf",
    INSTANTIATION = "instantiation",
    TERMINATION = "termination",
    PARTICIPATIONAL = "participational",
    PARTICIPATION = "participation",
    HISTORICAL_DEPENDENCE = "historicalDependence",
    CREATION = "creation",
    MANIFESTATION = "manifestation",
    BRINGS_ABOUT = "bringsAbout",
    TRIGGERS = "triggers"
}
export declare enum PropertyStereotype {
    BEGIN = "begin",
    END = "end"
}
declare function isNonSortalClassStereotype(stereotype: ClassStereotype): boolean;
declare function isSortalClassStereotype(stereotype: ClassStereotype): boolean;
declare function isUltimateSortalClassStereotype(stereotype: ClassStereotype): boolean;
declare function isBaseSortalClassStereotype(stereotype: ClassStereotype): boolean;
declare function isRigidClassStereotype(stereotype: ClassStereotype): boolean;
declare function isAntiRigidClassStereotype(stereotype: ClassStereotype): boolean;
declare function isSemiRigidClassStereotype(stereotype: ClassStereotype): boolean;
declare function isAbstractClassStereotype(stereotype: ClassStereotype): boolean;
declare function isEndurantClassStereotype(stereotype: ClassStereotype): boolean;
declare function isSubstantialClassStereotype(stereotype: ClassStereotype): boolean;
declare function isMomentClassStereotype(stereotype: ClassStereotype): boolean;
declare function isEventClassStereotype(stereotype: ClassStereotype): boolean;
declare function isSituationClassStereotype(stereotype: ClassStereotype): boolean;
declare function isTypeClassStereotype(stereotype: ClassStereotype): boolean;
export declare const stereotypeUtils: {
    ClassStereotypes: ClassStereotype[];
    AbstractStereotypes: ClassStereotype[];
    EndurantStereotypes: ClassStereotype[];
    SubstantialOnlyStereotypes: ClassStereotype[];
    MomentOnlyStereotypes: ClassStereotype[];
    NonSortalStereotypes: ClassStereotype[];
    SortalStereotypes: ClassStereotype[];
    UltimateSortalStereotypes: ClassStereotype[];
    BaseSortalStereotypes: ClassStereotype[];
    RigidStereotypes: ClassStereotype[];
    AntiRigidStereotypes: ClassStereotype[];
    SemiRigidStereotypes: ClassStereotype[];
    RelationStereotypes: RelationStereotype[];
    ExistentialDependencyRelationStereotypes: RelationStereotype[];
    ExistentialDependentSourceRelationStereotypes: RelationStereotype[];
    ExistentialDependentTargetRelationStereotypes: RelationStereotype[];
    PartWholeRelationStereotypes: RelationStereotype[];
    PropertyStereotypes: PropertyStereotype[];
    isNonSortalClassStereotype: typeof isNonSortalClassStereotype;
    isSortalClassStereotype: typeof isSortalClassStereotype;
    isUltimateSortalClassStereotype: typeof isUltimateSortalClassStereotype;
    isBaseSortalClassStereotype: typeof isBaseSortalClassStereotype;
    isRigidClassStereotype: typeof isRigidClassStereotype;
    isAntiRigidClassStereotype: typeof isAntiRigidClassStereotype;
    isSemiRigidClassStereotype: typeof isSemiRigidClassStereotype;
    isAbstractClassStereotype: typeof isAbstractClassStereotype;
    isEndurantClassStereotype: typeof isEndurantClassStereotype;
    isSubstantialClassStereotype: typeof isSubstantialClassStereotype;
    isMomentClassStereotype: typeof isMomentClassStereotype;
    isEventClassStereotype: typeof isEventClassStereotype;
    isSituationClassStereotype: typeof isSituationClassStereotype;
    isTypeClassStereotype: typeof isTypeClassStereotype;
};
export {};
