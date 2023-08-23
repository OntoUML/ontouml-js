import { ABSTRACT, CATEGORY, COLLECTIVE, ClassStereotype, DATATYPE, ENUMERATION, EVENT, HISTORICAL_ROLE, HISTORICAL_ROLE_MIXIN, KIND, MIXIN, MODE, PHASE, PHASE_MIXIN, QUALITY, QUANTITY, RELATOR, ROLE, ROLE_MIXIN, SITUATION, SUBKIND, TYPE } from '../../model/stereotypes';
import { Nature } from '../../model/natures';
import { Class, ORDERLESS_LEVEL } from '../../model/class';
import { Package } from '../../model/package';
import { ClassifierBuilder } from './classifier_builder';
import { Project } from '../../project';
import { utils } from '../../utils';

export class ClassBuilder extends ClassifierBuilder<ClassBuilder,ClassStereotype> {
   protected override _container?: Package;
   protected override element: Class;
   
   private _restrictedTo: Nature[] = [];
   private _order: number = 1;
   private _isPowertype: boolean = false;

   constructor (project: Project){
      super(project);
      this.element = new Class(this.project);
   }

   override build(): Class {
      super.build();

      // OntoumlElementBuilder
      this.element.id = this._id; 
      // NamedElementBuilder
      this.element.setName(this._name);
      this.element.setDescription(this._description);
      // ModelElementBuilder
      this.element.container = this._container;
      this.element.customProperties = this._customProperties
      // DecoratableBuilder
      this.element.stereotype = this._stereotype;
      this.element.isDerived = this._isDerived;
     
      // ClassBuilder
      this.element.order = this._order;
      this.element.isPowertype = this._isPowertype;
      this.element.restrictedTo = this._restrictedTo;
      
      return this.element;
   }

   container(pkg: Package): ClassBuilder {
      this._container = pkg;
      return this;
   }

   order(order:number): ClassBuilder {
      this._order = order
      return this;
   }

   orderless(): ClassBuilder {
      this._order = ORDERLESS_LEVEL
      return this;
   }

   powertype(): ClassBuilder {
      this._isPowertype = true
      
      if(this._order < 2) {
         this.order(2);
      }
      
      return this;
   }

   nonPowertype(): ClassBuilder {
      this._isPowertype = false
      return this;
   }

   // TODO: consider moving the setting of defaults to build, otherwise the order of calls will affect the resulting object
   override stereotype(stereotype: string): ClassBuilder {
      switch(stereotype){
         case KIND:
            return this.kind();
         case COLLECTIVE:
            return this.collective();
         case QUANTITY:
            return this.quantity();
         case RELATOR:
            return this.relator();
         case QUALITY:
            return this.quality();
         case MODE:
            return this.mode();
         case SUBKIND:
            return this.subkind();
         case ROLE:
            return this.role();
         case PHASE:
            return this.phase();
         case CATEGORY:
            return this.category();
         case MIXIN:
            return this.mixin();
         case ROLE_MIXIN:
            return this.roleMixin();
         case PHASE_MIXIN:
            return this.phaseMixin();
         case EVENT:
            return this.event();
         case SITUATION:
            return this.situation();
         case HISTORICAL_ROLE:
            return this.historicalRole();
         case HISTORICAL_ROLE_MIXIN:
            return this.historicalRoleMixin();
         case ENUMERATION:
            return this.enumeration();
         case DATATYPE:
            return this.datatype();
         case ABSTRACT:
            return this.abstractClass();
         case TYPE:
            return this.type();
      }

      return super.stereotype(stereotype);
   }

   /**
    * Sets the following fields:
    *  - stereotype as «kind»
    *  - restrictedTo as [ functional complex ]
    *  - isAbstract as false
    *  - order as 1
    */
   kind(): ClassBuilder {
      this._stereotype = KIND;
      this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
      this.order(1);
      return this;
   }
   
   /**
    * Sets the following fields:
    *  - stereotype as «collective»
    *  - restrictedTo as [ collective ]
    *  - isAbstract as false
    *  - order as 1
    */
   collective(): ClassBuilder {
      this._stereotype = COLLECTIVE;
      this.restrictedTo(Nature.COLLECTIVE);
      this.order(1);
      return this;
   }
   
   quantity(): ClassBuilder {
      this._stereotype = QUANTITY;
      this.restrictedTo(Nature.QUANTITY);
      this.order(1);
      return this;
   }
   
   relator(): ClassBuilder {
      this._stereotype = RELATOR;
      this.restrictedTo(Nature.RELATOR);
      this.order(1);
      return this;
   }
   
   quality(): ClassBuilder {
      this._stereotype = QUALITY;
      this.restrictedTo(Nature.QUALITY);
      this.order(1);
      return this;
   }
   
   mode(): ClassBuilder {
      this._stereotype = MODE;
      this.restrictedTo(Nature.INTRINSIC_MODE);
      this.order(1);
      return this;
   }
   
   subkind(): ClassBuilder {
      this._stereotype = SUBKIND;
      return this;
   }
   
   role(): ClassBuilder {
      this._stereotype = ROLE;
      return this;
   }
   
   phase(): ClassBuilder {
      this._stereotype = PHASE;
      return this;
   }
   
   category(): ClassBuilder {
      this._stereotype = CATEGORY;
      this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
      this.abstract();
      return this;
   }
   
   mixin(): ClassBuilder {
      this._stereotype = MIXIN;
      this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
      this.abstract();
      return this;
   }
   
   roleMixin(): ClassBuilder {
      this._stereotype = ROLE_MIXIN;
      this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
      this.abstract();
      return this;
   }
   
   phaseMixin(): ClassBuilder {
      this._stereotype = PHASE_MIXIN;
      this.restrictedTo(Nature.FUNCTIONAL_COMPLEX);
      this.abstract();
      return this;
   }
 
   event(): ClassBuilder {
      this._stereotype = EVENT;
      this.restrictedTo(Nature.EVENT);
      this.order(1);
      return this;
   }
   
   situation(): ClassBuilder {
      this._stereotype = SITUATION;
      this.restrictedTo(Nature.SITUATION);
      this.order(1);
      return this;
   }

   historicalRole(): ClassBuilder {
      this._stereotype = HISTORICAL_ROLE;
      this._isAbstract = false;
      return this;
   }
   
   historicalRoleMixin(): ClassBuilder {
      this._stereotype = HISTORICAL_ROLE_MIXIN;
      this._isAbstract = true;
      return this;
   }
   
   enumeration(): ClassBuilder {
      this._stereotype = ENUMERATION;
      this._restrictedTo = [ Nature.ABSTRACT ];
      this._isAbstract = false;
      return this;
   }
   
   datatype(): ClassBuilder {
      this._stereotype = DATATYPE;
      this._restrictedTo = [ Nature.ABSTRACT ];
      this._isAbstract = false;
      return this;
   }
   
   abstractClass(): ClassBuilder {
      this._stereotype = ABSTRACT;
      this.restrictedTo(Nature.ABSTRACT);
      this._isAbstract = false;
      return this;
   }

   type(): ClassBuilder {
      this._stereotype = TYPE;
      this._restrictedTo = [ Nature.TYPE ];
      this._isAbstract = false;
      return this;
   }

   restrictedTo(natures: Nature | Nature[] = []): ClassBuilder {
      this._restrictedTo = utils.arrayFrom(natures);
      return this;
   }

   functionalComplexType():ClassBuilder {
      this._restrictedTo.push(Nature.FUNCTIONAL_COMPLEX)
      return this;
   }

   collectiveType():ClassBuilder {
      this._restrictedTo.push(Nature.COLLECTIVE)
      return this;
   }

   quantityType():ClassBuilder {
      this._restrictedTo.push(Nature.QUANTITY)
      return this;
   }

   qualityType():ClassBuilder {
      this._restrictedTo.push(Nature.QUALITY)
      return this;
   }

   intrinsicModeType():ClassBuilder {
      this._restrictedTo.push(Nature.INTRINSIC_MODE)
      return this;
   }

   extrinsicModeType():ClassBuilder {
      this._restrictedTo.push(Nature.EXTRINSIC_MODE)
      return this;
   }

   relatorType():ClassBuilder {
      this._restrictedTo.push(Nature.RELATOR)
      return this;
   }

   eventType():ClassBuilder {
      this._restrictedTo.push(Nature.EVENT)
      return this;
   }

   situationType(): ClassBuilder {
      this._restrictedTo.push(Nature.SITUATION)
      return this;
   }

   highOrderType():ClassBuilder {
      this._restrictedTo.push(Nature.TYPE)
      
      if(this.order===undefined){
         if(this._restrictedTo)
         this.order(2);
      }

      return this;
   }

   abstractType():ClassBuilder {
      this._restrictedTo.push(Nature.ABSTRACT)
      return this;
   }


   substantialType(): ClassBuilder {
      this.functionalComplexType();
      this.collectiveType();
      this.quantityType();
      
      return this;
   }

   intrinsicMomentType(): ClassBuilder {
      this.qualityType();
      this.intrinsicModeType();
      return this;
   }

   extrinsicMomentType(): ClassBuilder {
      this.relatorType();
      this.extrinsicModeType();
      return this;
   }

   momentType(): ClassBuilder {
      this.intrinsicMomentType();
      this.extrinsicMomentType();
      return this;
   }

   endurantIndividualType(): ClassBuilder {
      this.substantialType();
      this.momentType();
      return this;
   }

   endurantType(): ClassBuilder {
      this.endurantIndividualType();
      this.highOrderType();
      this.orderless();
      return this;
   }

   concreteIndividualType(): ClassBuilder {
      this.endurantIndividualType();
      this.eventType();
      this.situationType();
      return this;
   }

   individualType(): ClassBuilder {
      this.concreteIndividualType();
      this.abstract();
      this.order(1);
      return this;
   }

   anyType(): ClassBuilder {
      this.concreteIndividualType();
      this.highOrderType();
      this.abstract();
      this.orderless();
      return this;
   }
   
}

