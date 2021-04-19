import { ClassStereotype, PropertyStereotype, RelationStereotype, stereotypeUtils } from '@libs/ontouml';

describe(`Test stereotype handling utility`, () => {
  describe('Test class stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.ClassStereotypes).toHaveLength(21));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.TYPE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE_MIXIN);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.EVENT);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.SITUATION);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.CATEGORY);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.MIXIN);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.ROLE_MIXIN);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.PHASE_MIXIN);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.KIND);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.COLLECTIVE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.QUANTITY);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.RELATOR);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.QUALITY);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.MODE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.SUBKIND);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.ROLE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.PHASE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.ENUMERATION);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.DATATYPE);
      expect(stereotypeUtils.ClassStereotypes).toContain(ClassStereotype.ABSTRACT);
    });
  });

  describe('Test abstract class stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.AbstractStereotypes).toHaveLength(3));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.AbstractStereotypes).toContain(ClassStereotype.ENUMERATION);
      expect(stereotypeUtils.AbstractStereotypes).toContain(ClassStereotype.DATATYPE);
      expect(stereotypeUtils.AbstractStereotypes).toContain(ClassStereotype.ABSTRACT);
    });
  });

  describe('Test endurant stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.EndurantStereotypes).toHaveLength(15));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE_MIXIN);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.CATEGORY);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.MIXIN);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.ROLE_MIXIN);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.PHASE_MIXIN);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.KIND);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.COLLECTIVE);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.QUANTITY);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.RELATOR);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.QUALITY);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.MODE);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.SUBKIND);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.ROLE);
      expect(stereotypeUtils.EndurantStereotypes).toContain(ClassStereotype.PHASE);
    });
  });

  describe('Test class stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.SubstantialOnlyStereotypes).toHaveLength(3));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.SubstantialOnlyStereotypes).toContain(ClassStereotype.KIND);
      expect(stereotypeUtils.SubstantialOnlyStereotypes).toContain(ClassStereotype.COLLECTIVE);
      expect(stereotypeUtils.SubstantialOnlyStereotypes).toContain(ClassStereotype.QUANTITY);
    });
  });

  describe('Test moment-only stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.MomentOnlyStereotypes).toHaveLength(3));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.MomentOnlyStereotypes).toContain(ClassStereotype.RELATOR);
      expect(stereotypeUtils.MomentOnlyStereotypes).toContain(ClassStereotype.QUALITY);
      expect(stereotypeUtils.MomentOnlyStereotypes).toContain(ClassStereotype.MODE);
    });
  });

  describe('Test non-sortal stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.NonSortalStereotypes).toHaveLength(5));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.NonSortalStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE_MIXIN);
      expect(stereotypeUtils.NonSortalStereotypes).toContain(ClassStereotype.CATEGORY);
      expect(stereotypeUtils.NonSortalStereotypes).toContain(ClassStereotype.MIXIN);
      expect(stereotypeUtils.NonSortalStereotypes).toContain(ClassStereotype.ROLE_MIXIN);
      expect(stereotypeUtils.NonSortalStereotypes).toContain(ClassStereotype.PHASE_MIXIN);
    });
  });

  describe('Test sortal stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.SortalStereotypes).toHaveLength(10));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.KIND);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.COLLECTIVE);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.QUANTITY);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.RELATOR);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.QUALITY);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.MODE);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.SUBKIND);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.ROLE);
      expect(stereotypeUtils.SortalStereotypes).toContain(ClassStereotype.PHASE);
    });
  });

  describe('Test ultimate sortal stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.UltimateSortalStereotypes).toHaveLength(6));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.UltimateSortalStereotypes).toContain(ClassStereotype.KIND);
      expect(stereotypeUtils.UltimateSortalStereotypes).toContain(ClassStereotype.COLLECTIVE);
      expect(stereotypeUtils.UltimateSortalStereotypes).toContain(ClassStereotype.QUANTITY);
      expect(stereotypeUtils.UltimateSortalStereotypes).toContain(ClassStereotype.RELATOR);
      expect(stereotypeUtils.UltimateSortalStereotypes).toContain(ClassStereotype.QUALITY);
      expect(stereotypeUtils.UltimateSortalStereotypes).toContain(ClassStereotype.MODE);
    });
  });

  describe('Test base sortal stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.BaseSortalStereotypes).toHaveLength(4));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.BaseSortalStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE);
      expect(stereotypeUtils.BaseSortalStereotypes).toContain(ClassStereotype.SUBKIND);
      expect(stereotypeUtils.BaseSortalStereotypes).toContain(ClassStereotype.ROLE);
      expect(stereotypeUtils.BaseSortalStereotypes).toContain(ClassStereotype.PHASE);
    });
  });

  describe('Test rigid stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.RigidStereotypes).toHaveLength(8));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.CATEGORY);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.KIND);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.COLLECTIVE);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.QUANTITY);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.RELATOR);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.QUALITY);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.MODE);
      expect(stereotypeUtils.RigidStereotypes).toContain(ClassStereotype.SUBKIND);
    });
  });

  describe('Test anti-rigid stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.AntiRigidStereotypes).toHaveLength(6));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.AntiRigidStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE);
      expect(stereotypeUtils.AntiRigidStereotypes).toContain(ClassStereotype.HISTORICAL_ROLE_MIXIN);
      expect(stereotypeUtils.AntiRigidStereotypes).toContain(ClassStereotype.ROLE_MIXIN);
      expect(stereotypeUtils.AntiRigidStereotypes).toContain(ClassStereotype.PHASE_MIXIN);
      expect(stereotypeUtils.AntiRigidStereotypes).toContain(ClassStereotype.ROLE);
      expect(stereotypeUtils.AntiRigidStereotypes).toContain(ClassStereotype.PHASE);
    });
  });

  describe('Test semi-rigid stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.SemiRigidStereotypes).toHaveLength(1));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.SemiRigidStereotypes).toContain(ClassStereotype.MIXIN);
    });
  });

  describe('Test relation stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.RelationStereotypes).toHaveLength(19));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.MATERIAL);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.DERIVATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.COMPARATIVE);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.MEDIATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.CHARACTERIZATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.EXTERNAL_DEPENDENCE);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.COMPONENT_OF);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.MEMBER_OF);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.SUBCOLLECTION_OF);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.SUBQUANTITY_OF);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.INSTANTIATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.TERMINATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.PARTICIPATIONAL);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.PARTICIPATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.HISTORICAL_DEPENDENCE);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.CREATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.MANIFESTATION);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.BRINGS_ABOUT);
      expect(stereotypeUtils.RelationStereotypes).toContain(RelationStereotype.TRIGGERS);
    });
  });

  describe('Test existential dependency stereotypes array', () => {
    it('There should be a know number of stereotypes', () =>
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toHaveLength(11));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.BRINGS_ABOUT);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.CHARACTERIZATION);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.CREATION);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.MANIFESTATION);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.PARTICIPATION);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.PARTICIPATIONAL);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.TERMINATION);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.TRIGGERS);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.EXTERNAL_DEPENDENCE);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.HISTORICAL_DEPENDENCE);
      expect(stereotypeUtils.ExistentialDependencyRelationStereotypes).toContain(RelationStereotype.MEDIATION);
    });
  });

  describe('Test "existential dependent source" stereotypes array', () => {
    it('There should be a know number of stereotypes', () =>
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toHaveLength(7));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.BRINGS_ABOUT);
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.CREATION);
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.MANIFESTATION);
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.PARTICIPATION);
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.PARTICIPATIONAL);
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.TERMINATION);
      expect(stereotypeUtils.ExistentialDependentSourceRelationStereotypes).toContain(RelationStereotype.TRIGGERS);
    });
  });

  describe('Test "existential dependent target" stereotypes array', () => {
    it('There should be a know number of stereotypes', () =>
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toHaveLength(7));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.BRINGS_ABOUT);
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.CHARACTERIZATION);
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.CREATION);
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.EXTERNAL_DEPENDENCE);
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.HISTORICAL_DEPENDENCE);
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.MEDIATION);
      expect(stereotypeUtils.ExistentialDependentTargetRelationStereotypes).toContain(RelationStereotype.PARTICIPATIONAL);
    });
  });

  describe('Test part-whole stereotypes array', () => {
    it('There should be a know number of stereotypes', () =>
      expect(stereotypeUtils.PartWholeRelationStereotypes).toHaveLength(5));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.PartWholeRelationStereotypes).toContain(RelationStereotype.COMPONENT_OF);
      expect(stereotypeUtils.PartWholeRelationStereotypes).toContain(RelationStereotype.MEMBER_OF);
      expect(stereotypeUtils.PartWholeRelationStereotypes).toContain(RelationStereotype.SUBCOLLECTION_OF);
      expect(stereotypeUtils.PartWholeRelationStereotypes).toContain(RelationStereotype.SUBQUANTITY_OF);
      expect(stereotypeUtils.PartWholeRelationStereotypes).toContain(RelationStereotype.PARTICIPATIONAL);
    });
  });

  describe('Test property stereotypes array', () => {
    it('There should be a know number of stereotypes', () => expect(stereotypeUtils.PropertyStereotypes).toHaveLength(2));
    it('Each of these must be a in the array', () => {
      expect(stereotypeUtils.PropertyStereotypes).toContain(PropertyStereotype.BEGIN);
      expect(stereotypeUtils.PropertyStereotypes).toContain(PropertyStereotype.END);
    });
  });
});
