import {
  AggregationKind,
  Project,
  Property,
  PropertyStereotype,
  propertyUtils,
  serializationUtils,
  stereotypesUtils
} from '@libs/ontouml';

describe(`${Property.name} Tests`, () => {
  describe(`Test ${Property.prototype.hasStereotypeContainedIn.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);

    startDate.stereotype = PropertyStereotype.BEGIN;

    it('Test function call', () => expect(startDate.hasStereotypeContainedIn(stereotypesUtils.PropertyStereotypes)).toBe(true));
  });

  describe(`Test ${Property.prototype.hasValidStereotypeValue.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = summerFestival.createAttribute(date);
    const endDate = summerFestival.createAttribute(date);
    const precedes = summerFestival.createAttribute(summerFestival);

    startDate.stereotype = PropertyStereotype.BEGIN;
    endDate.stereotype = PropertyStereotype.END;

    it('Test function call', () => expect(startDate.hasValidStereotypeValue()).toBe(true));
    it('Test function call', () => expect(endDate.hasValidStereotypeValue()).toBe(true));
    it('Test function call', () => expect(precedes.hasValidStereotypeValue()).toBe(true));
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
    it('Test serialization', () => expect(serializationUtils.validate(endDate.project)).toBeTruthy());
  });

  describe(`Test ${Property.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const summerFestival = model.createEvent();
    const startDate = new Property({ propertyType: date, project: model.project });

    it('Test function call', () => {
      expect(startDate.container).not.toBe(summerFestival);
      expect(summerFestival.getContents()).not.toContain(startDate);

      startDate.setContainer(summerFestival);

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

  describe(`Test ${Property.prototype.isPropertyTypeDefined.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const precedes = model.createBinaryRelation(event, event);
    const prop = new Property();

    it('Test startDate', () => expect(startDate.isPropertyTypeDefined()).toBe(true));
    it('Test precedes', () => expect(precedes.getSourceEnd().isPropertyTypeDefined()).toBe(true));
    it('Test precedes', () => expect(precedes.getTargetEnd().isPropertyTypeDefined()).toBe(true));
    it('Test prop', () => expect(prop.isPropertyTypeDefined()).toBe(false));
  });

  describe(`Test ${Property.prototype.isSharedAggregationEnd.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const partOf = model.createPartWholeRelation(event, event);
    const prop = new Property();

    partOf.getTargetEnd().aggregationKind = AggregationKind.SHARED;

    it('Test startDate', () => expect(startDate.isSharedAggregationEnd()).toBe(false));
    it('Test partOf', () => expect(partOf.getSourceEnd().isSharedAggregationEnd()).toBe(false));
    it('Test partOf', () => expect(partOf.getTargetEnd().isSharedAggregationEnd()).toBe(true));
    it('Test prop', () => expect(prop.isSharedAggregationEnd()).toBe(false));
  });

  describe(`Test ${Property.prototype.isCompositeAggregationEnd.name}()`, () => {
    const model = new Project().createModel();
    const date = model.createDatatype();
    const event = model.createEvent();
    const startDate = event.createAttribute(date);
    const partOf = model.createPartWholeRelation(event, event);
    const prop = new Property();

    partOf.getTargetEnd().aggregationKind = AggregationKind.COMPOSITE;

    it('Test startDate', () => expect(startDate.isCompositeAggregationEnd()).toBe(false));
    it('Test partOf', () => expect(partOf.getSourceEnd().isCompositeAggregationEnd()).toBe(false));
    it('Test partOf', () => expect(partOf.getTargetEnd().isCompositeAggregationEnd()).toBe(true));
    it('Test prop', () => expect(prop.isCompositeAggregationEnd()).toBe(false));
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

  describe(`Test ${Property.prototype.setCardinality.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isZeroToMany()).toBe(true);
      prop.setCardinality(0, 1);
      expect(prop.isZeroToOne()).toBe(true);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isOneToMany()).toBe(true);
      prop.setCardinality(1, 1);
      expect(prop.isOneToOne()).toBe(true);
    });
  });

  describe(`Test ${Property.prototype.setCardinalityToZeroToOne.name}()`, () => {
    const prop = new Property();
    prop.setCardinalityToZeroToOne();

    it('Test cardinality', () => expect(prop.isZeroToOne()).toBe(true));
  });

  describe(`Test ${Property.prototype.setCardinalityToMany.name}()`, () => {
    const prop = new Property();
    prop.setCardinalityToMany();

    it('Test cardinality', () => expect(prop.isZeroToMany()).toBe(true));
  });

  describe(`Test ${Property.prototype.setCardinalityToOne.name}()`, () => {
    const prop = new Property();
    prop.setCardinalityToOne();

    it('Test cardinality', () => expect(prop.isOneToOne()).toBe(true));
  });

  describe(`Test ${Property.prototype.setCardinalityToOneToMany.name}()`, () => {
    const prop = new Property();
    prop.setCardinalityToOneToMany();

    it('Test cardinality', () => expect(prop.isOneToMany()).toBe(true));
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

  describe(`Test ${Property.prototype.isOptional.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isOptional()).toBe(true);
      prop.setCardinality(0, 1);
      expect(prop.isOptional()).toBe(true);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isOptional()).toBe(false);
      prop.setCardinality(1, 1);
      expect(prop.isOptional()).toBe(false);
    });
  });

  describe(`Test ${Property.prototype.isMandatory.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isMandatory()).toBe(false);
      prop.setCardinality(0, 1);
      expect(prop.isMandatory()).toBe(false);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isMandatory()).toBe(true);
      prop.setCardinality(1, 1);
      expect(prop.isMandatory()).toBe(true);
    });
  });

  describe(`Test ${Property.prototype.isZeroToOne.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isZeroToOne()).toBe(false);
      prop.setCardinality(0, 1);
      expect(prop.isZeroToOne()).toBe(true);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isZeroToOne()).toBe(false);
      prop.setCardinality(1, 1);
      expect(prop.isZeroToOne()).toBe(false);
    });
  });

  describe(`Test ${Property.prototype.isZeroToMany.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isZeroToMany()).toBe(true);
      prop.setCardinality(0, 1);
      expect(prop.isZeroToMany()).toBe(false);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isZeroToMany()).toBe(false);
      prop.setCardinality(1, 1);
      expect(prop.isZeroToMany()).toBe(false);
    });
  });

  describe(`Test ${Property.prototype.isOneToOne.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isOneToOne()).toBe(false);
      prop.setCardinality(0, 1);
      expect(prop.isOneToOne()).toBe(false);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isOneToOne()).toBe(false);
      prop.setCardinality(1, 1);
      expect(prop.isOneToOne()).toBe(true);
    });
  });

  describe(`Test ${Property.prototype.isOneToMany.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.isOneToMany()).toBe(false);
      prop.setCardinality(0, 1);
      expect(prop.isOneToMany()).toBe(false);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.isOneToMany()).toBe(true);
      prop.setCardinality(1, 1);
      expect(prop.isOneToMany()).toBe(false);
    });
  });

  describe(`Test ${Property.prototype.hasValidCardinality.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.hasValidCardinality()).toBe(true);
      prop.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);
      expect(prop.hasValidCardinality()).toBe(true);
      prop.cardinality = { lowerBound: -1, upperBound: -1 };
      expect(prop.hasValidCardinality()).toBe(false);
    });
  });

  describe(`Test Property.${Property.isCardinalityValid.name}()`, () => {
    it('Test cardinalities', () => {
      expect(Property.isCardinalityValid({ lowerBound: 0, upperBound: 1 })).toBe(true);
      expect(Property.isCardinalityValid({ lowerBound: 0, upperBound: propertyUtils.UNBOUNDED_CARDINALITY })).toBe(true);
      expect(
        Property.isCardinalityValid({
          lowerBound: propertyUtils.UNBOUNDED_CARDINALITY,
          upperBound: propertyUtils.UNBOUNDED_CARDINALITY
        })
      ).toBe(false);
      expect(Property.isCardinalityValid({ lowerBound: -1, upperBound: -1 })).toBe(false);
    });
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
