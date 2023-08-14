import { describe, expect, it } from '@jest/globals';
import { AggregationKind, Project, Property, PropertyStereotype, serializationUtils, stereotypeUtils } from '../src';

describe(`${Property.name} Tests`, () => {
  describe(`Test ${Property.prototype.isStereotypeOneOf.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);

    startDate.stereotype = PropertyStereotype.BEGIN;

    it('Test function call', () => expect(startDate.isStereotypeOneOf(stereotypeUtils.PropertyStereotypes)).toBe(true));
  });

  describe(`Test ${Property.prototype.hasValidStereotype.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);
    const precedes = summerFestival.createAttribute(summerFestival);

    startDate.stereotype = PropertyStereotype.BEGIN;

    it('should return true for an attribute with an OntoUML stereotype', () => {
      expect(startDate.hasValidStereotype()).toBe(true);
    });

    it('should return true for an attribute without a stereotype (by default; allowsNone: true)', () => {
      expect(precedes.hasValidStereotype()).toBe(true);
    });

    it('should return false for an attribute without a stereotype (allowsNone: false)', () => {
      expect(precedes.hasValidStereotype(false)).toBe(false);
    });
  });

  describe(`Test ${Property.prototype.toJSON.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);
    const endDate = summerFestival.createAttribute(date);
    const precedes = summerFestival.createAttribute(summerFestival);

    startDate.stereotype = PropertyStereotype.BEGIN;
    endDate.stereotype = PropertyStereotype.END;

    it('Test serialization', () => expect(() => JSON.stringify(startDate)).not.toThrow());
    it('Test serialization', () => expect(() => JSON.stringify(precedes)).not.toThrow());
    it('Test serialization', () => expect(serializationUtils.validate(endDate.project)).toBe(true));
  });

  describe(`Test ${Property.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = new Property({ propertyType: date, project: model.project });

    it('Test function call', () => {
      expect(startDate.container).not.toBe(summerFestival);
      expect(summerFestival.getContents()).not.toContain(startDate);

      summerFestival.addAttribute(startDate);

      expect(startDate.container).toBe(summerFestival);
      expect(summerFestival.getContents()).toContain(startDate);
    });
  });

  describe(`Test ${Property.prototype.isAttribute.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);
    const precedes = model.createBinaryRelation(summerFestival, summerFestival);

    it('Test startDate', () => expect(startDate.isAttribute()).toBe(true));
    it('Test precedes', () => expect(precedes.getSourceEnd().isAttribute()).toBe(false));
  });

  describe(`Test ${Property.prototype.isRelationEnd.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);
    const precedes = model.createBinaryRelation(summerFestival, summerFestival);

    it('Test startDate', () => expect(startDate.isRelationEnd()).toBe(false));
    it('Test precedes', () => expect(precedes.getSourceEnd().isRelationEnd()).toBe(true));
  });

  describe(`Test ${Property.prototype.hasPropertyType.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const precedes = model.createBinaryRelation(event, event);
    const prop = new Property();

    it('Test startDate', () => expect(startDate.hasPropertyType()).toBe(true));
    it('Test precedes', () => expect(precedes.getSourceEnd().hasPropertyType()).toBe(true));
    it('Test precedes', () => expect(precedes.getTargetEnd().hasPropertyType()).toBe(true));
    it('Test prop', () => expect(prop.hasPropertyType()).toBe(false));
  });

  describe(`Test ${Property.prototype.isShared.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const partOf = model.createPartWholeRelation(event, event);
    const prop = new Property();

    partOf.getTargetEnd().aggregationKind = AggregationKind.SHARED;

    it('Test startDate', () => expect(startDate.isShared()).toBe(false));
    it('Test partOf', () => expect(partOf.getSourceEnd().isShared()).toBe(false));
    it('Test partOf', () => expect(partOf.getTargetEnd().isShared()).toBe(true));
    it('Test prop', () => expect(prop.isShared()).toBe(false));
  });

  describe(`Test ${Property.prototype.isComposite.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const partOf = model.createPartWholeRelation(event, event);
    const prop = new Property();

    partOf.getTargetEnd().aggregationKind = AggregationKind.COMPOSITE;

    it('Test startDate', () => expect(startDate.isComposite()).toBe(false));
    it('Test partOf', () => expect(partOf.getSourceEnd().isComposite()).toBe(false));
    it('Test partOf', () => expect(partOf.getTargetEnd().isComposite()).toBe(true));
    it('Test prop', () => expect(prop.isComposite()).toBe(false));
  });

  describe(`Test ${Property.prototype.isAggregationEnd.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const partOf = model.createPartWholeRelation(event, event);
    const prop = new Property();

    partOf.getTargetEnd().aggregationKind = AggregationKind.SHARED;

    it('Test startDate', () => expect(startDate.isAggregationEnd()).toBe(false));
    it('Test partOf', () => expect(partOf.getSourceEnd().isAggregationEnd()).toBe(false));
    it('Test partOf', () => expect(partOf.getTargetEnd().isAggregationEnd()).toBe(true));
    it('Test prop', () => expect(prop.isAggregationEnd()).toBe(false));
  });

  describe(`Test ${Property.prototype.getOppositeEnd.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const partOf = model.createPartWholeRelation(event, event);

    partOf.getTargetEnd().aggregationKind = AggregationKind.SHARED;

    it('Test startDate', () => expect(() => startDate.getOppositeEnd()).toThrow());
    it('Test partOf', () => expect(partOf.getSourceEnd().getOppositeEnd()).toBe(partOf.getTargetEnd()));
    it('Test partOf', () => expect(partOf.getTargetEnd().getOppositeEnd()).toBe(partOf.getSourceEnd()));
  });

  describe(`Test ${Property.prototype.getOtherEnds.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const heldBetween = model.createTernaryRelation([event, event, event]);
    const end0 = heldBetween.getMemberEnd(0);
    const end1 = heldBetween.getMemberEnd(1);
    const end2 = heldBetween.getMemberEnd(2);

    it('Test startDate', () => expect(() => startDate.getOtherEnds()).toThrow());
    it('Test end0', () => expect(end0.getOtherEnds()).toContain(end1));
    it('Test end0', () => expect(end0.getOtherEnds()).toContain(end2));
    it('Test end0', () => expect(end0.getOtherEnds().length).toBe(2));
  });

  describe(`Test ${Property.prototype.clone.name}()`, () => {
    const model = new Project().createModel();
    const classA = model.createClass();
    const propA = classA.createAttribute(classA);
    const propB = propA.clone();

    const propC = new Property();
    const propD = propC.clone();

    it('Test method', () => expect(propA).toEqual(propB));
    it('Test method', () => expect(propC).toEqual(propD));
  });
});
