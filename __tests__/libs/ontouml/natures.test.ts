import { natureUtils, OntologicalNature } from '@libs/ontouml';

describe(`Test ontological nature handling utility`, () => {
  describe('Test natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.Natures).toHaveLength(11));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.Natures).toContain(OntologicalNature.functional_complex);
      expect(natureUtils.Natures).toContain(OntologicalNature.collective);
      expect(natureUtils.Natures).toContain(OntologicalNature.quantity);
      expect(natureUtils.Natures).toContain(OntologicalNature.relator);
      expect(natureUtils.Natures).toContain(OntologicalNature.intrinsic_mode);
      expect(natureUtils.Natures).toContain(OntologicalNature.extrinsic_mode);
      expect(natureUtils.Natures).toContain(OntologicalNature.quality);
      expect(natureUtils.Natures).toContain(OntologicalNature.event);
      expect(natureUtils.Natures).toContain(OntologicalNature.situation);
      expect(natureUtils.Natures).toContain(OntologicalNature.type);
      expect(natureUtils.Natures).toContain(OntologicalNature.abstract);
    });
  });

  describe('Test endurant natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.EndurantNatures).toHaveLength(7));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.functional_complex);
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.collective);
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.quantity);
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.relator);
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.intrinsic_mode);
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.extrinsic_mode);
      expect(natureUtils.EndurantNatures).toContain(OntologicalNature.quality);
    });
  });

  describe('Test substantial natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.SubstantialNatures).toHaveLength(3));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.SubstantialNatures).toContain(OntologicalNature.functional_complex);
      expect(natureUtils.SubstantialNatures).toContain(OntologicalNature.collective);
      expect(natureUtils.SubstantialNatures).toContain(OntologicalNature.quantity);
    });
  });

  describe('Test moment natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.MomentNatures).toHaveLength(4));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.MomentNatures).toContain(OntologicalNature.relator);
      expect(natureUtils.MomentNatures).toContain(OntologicalNature.intrinsic_mode);
      expect(natureUtils.MomentNatures).toContain(OntologicalNature.extrinsic_mode);
      expect(natureUtils.MomentNatures).toContain(OntologicalNature.quality);
    });
  });

  describe('Test intrinsic moment natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.IntrinsicMomentNatures).toHaveLength(2));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.IntrinsicMomentNatures).toContain(OntologicalNature.intrinsic_mode);
      expect(natureUtils.IntrinsicMomentNatures).toContain(OntologicalNature.quality);
    });
  });

  describe('Test extrinsic moment natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.ExtrinsicMomentNatures).toHaveLength(2));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.ExtrinsicMomentNatures).toContain(OntologicalNature.extrinsic_mode);
      expect(natureUtils.ExtrinsicMomentNatures).toContain(OntologicalNature.relator);
    });
  });
});
