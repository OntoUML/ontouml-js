import { ABSTRACT, CATEGORY, COLLECTIVE, ClassStereotype, DATATYPE, ENUMERATION, EVENT, HISTORICAL_ROLE, HISTORICAL_ROLE_MIXIN, KIND, MIXIN, MODE, PHASE, PHASE_MIXIN, QUALITY, QUANTITY, RELATOR, ROLE, ROLE_MIXIN, SITUATION, SUBKIND, TYPE } from '../../model/stereotypes';
import { Nature } from '../../model/natures';
import { Class, ORDERLESS_LEVEL } from '../../model/class';
import { Package } from '../../model/package';
import { ClassifierBuilder } from './classifier_builder';

export class ClassBuilder extends ClassifierBuilder<ClassBuilder,ClassStereotype> {
   protected override _container?: Package;
   private _restrictedTo: Nature[] = [];
   private _order: number = 1;
   private _isPowertype: boolean = false;

   build(): Class {
      // OntoumlElementBuilder
      const c = new Class(this.project);
      c.id = this._id;
      // NamedElementBuilder
      c.setName(this._name);
      c.setDescription(this._description);
      // ModelElementBuilder
      c.container = this._container;
      c.customProperties = this._customProperties
      // DecoratableBuilder
      c.stereotype = this._stereotype;
      c.isDerived = this._isDerived;
      // ClassifierBuilder
      c.isAbstract = this._isAbstract;
      // ClassBuilder
      c.order = this._order;
      c.isPowertype = this._isPowertype;
      c.restrictedTo = this._restrictedTo;

      return c;
   }

   container(pkg: Package): ClassBuilder {
      this._container = pkg;
      return this;
   }

   order(order:number): ClassBuilder {
      this._order = order
      return this;
   }

   firstOrder(): ClassBuilder {
      this._order = 1
      return this;
   }

   secondOrder(): ClassBuilder {
      this._order = 2
      return this;
   }

   thirdOrder(): ClassBuilder {
      this._order = 3
      return this;
   }

   orderless(): ClassBuilder {
      this._order = ORDERLESS_LEVEL
      return this;
   }

   powertype(): ClassBuilder {
      this._isPowertype = true
      
      if(this._order < 2) {
         this.secondOrder();
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

      return super.stereotype(stereotype) as ClassBuilder;
   }

   kind(): ClassBuilder {
      this._stereotype = KIND;
      this._restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this._isAbstract = false;
      return this;
   }
   
   collective(): ClassBuilder {
      this._stereotype = COLLECTIVE;
      this._restrictedTo = [ Nature.COLLECTIVE ];
      this._isAbstract = false;
      return this;
   }
   
   quantity(): ClassBuilder {
      this._stereotype = QUANTITY;
      this._restrictedTo = [ Nature.QUANTITY ];
      this._isAbstract = false;
      return this;
   }
   
   relator(): ClassBuilder {
      this._stereotype = RELATOR;
      this._restrictedTo = [ Nature.RELATOR ];
      this._isAbstract = false;
      return this;
   }
   
   quality(): ClassBuilder {
      this._stereotype = QUALITY;
      this._restrictedTo = [ Nature.QUALITY ];
      this._isAbstract = false;
      return this;
   }
   
   mode(): ClassBuilder {
      this._stereotype = MODE;
      this._restrictedTo = [ Nature.INTRINSIC_MODE, Nature.EXTRINSIC_MODE ];
      this._isAbstract = false;
      return this;
   }
   
   subkind(): ClassBuilder {
      this._stereotype = SUBKIND;
      this._isAbstract = false;
      return this;
   }
   
   role(): ClassBuilder {
      this._stereotype = ROLE;
      this._isAbstract = false;
      return this;
   }
   
   phase(): ClassBuilder {
      this._stereotype = PHASE;
      this._isAbstract = false;
      return this;
   }
   
   category(): ClassBuilder {
      this._stereotype = CATEGORY;
      this._restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this._isAbstract = true;
      return this;
   }
   
   mixin(): ClassBuilder {
      this._stereotype = MIXIN;
      this._restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this._isAbstract = true;
      return this;
   }
   
   roleMixin(): ClassBuilder {
      this._stereotype = ROLE_MIXIN;
      this._restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this._isAbstract = true;
      return this;
   }
   
   phaseMixin(): ClassBuilder {
      this._stereotype = PHASE_MIXIN;
      this._restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this._isAbstract = true;
      return this;
   }
 
   event(): ClassBuilder {
      this._stereotype = EVENT;
      this._restrictedTo = [ Nature.EVENT ];
      this._isAbstract = false;
      return this;
   }
   
   situation(): ClassBuilder {
      this._stereotype = SITUATION;
      this._restrictedTo = [ Nature.SITUATION ];
      this._isAbstract = false;
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
      this._restrictedTo = [ Nature.ABSTRACT ];
      this._isAbstract = false;
      return this;
   }

   type(): ClassBuilder {
      this._stereotype = TYPE;
      this._restrictedTo = [ Nature.TYPE ];
      this._isAbstract = false;
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

   situationType():ClassBuilder {
      this._restrictedTo.push(Nature.SITUATION)
      return this;
   }

   highOrderType():ClassBuilder {
      this._restrictedTo.push(Nature.TYPE)
      return this;
   }

   abstractType():ClassBuilder {
      this._restrictedTo.push(Nature.ABSTRACT)
      return this;
   }
   
}

