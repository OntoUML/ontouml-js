import uniqid from 'uniqid';
import { ABSTRACT, CATEGORY, COLLECTIVE, ClassStereotype, DATATYPE, ENUMERATION, EVENT, HISTORICAL_ROLE, HISTORICAL_ROLE_MIXIN, KIND, MIXIN, MODE, PHASE, PHASE_MIXIN, QUALITY, QUANTITY, RELATOR, ROLE, ROLE_MIXIN, SITUATION, SUBKIND, TYPE } from '../model/stereotypes';
import { Nature } from '../../model/natures';
import { Class } from '../../model/class';
import { Project } from '../../project';
import { Package } from '../../model/package';

export class ClassBuilder {
   private project;
   private _container?: Package;
   private _id: string;
   private name?: string;
   private _stereotype?: ClassStereotype;
   private isAbstract: boolean = false;
   private isDerived: boolean = false;
   private restrictedTo: Nature[] = [];

   constructor(project: Project) {
      this._id = uniqid();
      this.project = project;
   }

   build(): Class {
      let c = new Class(this.project);
      c.id = this._id;
      c.stereotype = this._stereotype;
      c.isAbstract = this.isAbstract;
      c.restrictedTo = this.restrictedTo;
      c.isDerived = this.isDerived;

      return c;
   }

   id(id: string): ClassBuilder {
      this._id = id;
      return this;
   }

   abstract(): ClassBuilder {
      this.isAbstract = true;
      return this;
   }
   
   concrete(): ClassBuilder {
      this.isAbstract = false;
      return this;
   }

   derived(): ClassBuilder {
      this.isDerived = true;
      return this;
   }

   base(): ClassBuilder {
      this.isDerived = false;
      return this;
   }

   container(pkg: Package): ClassBuilder {
      this._container = pkg;
      return this;
   }

   stereotype(stereotype: string): ClassBuilder {
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

      this._stereotype = stereotype as any;
      return this;
   }

   kind(): ClassBuilder {
      this._stereotype = KIND;
      this.restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this.isAbstract = false;
      return this;
   }
   
   collective(): ClassBuilder {
      this._stereotype = COLLECTIVE;
      this.restrictedTo = [ Nature.COLLECTIVE ];
      this.isAbstract = false;
      return this;
   }
   
   quantity(): ClassBuilder {
      this._stereotype = QUANTITY;
      this.restrictedTo = [ Nature.QUANTITY ];
      this.isAbstract = false;
      return this;
   }
   
   relator(): ClassBuilder {
      this._stereotype = RELATOR;
      this.restrictedTo = [ Nature.RELATOR ];
      this.isAbstract = false;
      return this;
   }
   
   quality(): ClassBuilder {
      this._stereotype = QUALITY;
      this.restrictedTo = [ Nature.QUALITY ];
      this.isAbstract = false;
      return this;
   }
   
   mode(): ClassBuilder {
      this._stereotype = MODE;
      this.restrictedTo = [ Nature.INTRINSIC_MODE, Nature.EXTRINSIC_MODE ];
      this.isAbstract = false;
      return this;
   }
   
   subkind(): ClassBuilder {
      this._stereotype = SUBKIND;
      this.isAbstract = false;
      return this;
   }
   
   role(): ClassBuilder {
      this._stereotype = ROLE;
      this.isAbstract = false;
      return this;
   }
   
   phase(): ClassBuilder {
      this._stereotype = PHASE;
      this.isAbstract = false;
      return this;
   }
   
   category(): ClassBuilder {
      this._stereotype = CATEGORY;
      this.restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this.isAbstract = true;
      return this;
   }
   
   mixin(): ClassBuilder {
      this._stereotype = MIXIN;
      this.restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this.isAbstract = true;
      return this;
   }
   
   roleMixin(): ClassBuilder {
      this._stereotype = ROLE_MIXIN;
      this.restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this.isAbstract = true;
      return this;
   }
   
   phaseMixin(): ClassBuilder {
      this._stereotype = PHASE_MIXIN;
      this.restrictedTo = [ Nature.FUNCTIONAL_COMPLEX ];
      this.isAbstract = true;
      return this;
   }
 
   event(): ClassBuilder {
      this._stereotype = EVENT;
      this.restrictedTo = [ Nature.EVENT ];
      this.isAbstract = false;
      return this;
   }
   
   situation(): ClassBuilder {
      this._stereotype = SITUATION;
      this.restrictedTo = [ Nature.SITUATION ];
      this.isAbstract = false;
      return this;
   }

   historicalRole(): ClassBuilder {
      this._stereotype = HISTORICAL_ROLE;
      this.isAbstract = false;
      return this;
   }
   
   historicalRoleMixin(): ClassBuilder {
      this._stereotype = HISTORICAL_ROLE_MIXIN;
      this.isAbstract = true;
      return this;
   }
   
   enumeration(): ClassBuilder {
      this._stereotype = ENUMERATION;
      this.restrictedTo = [ Nature.ABSTRACT ];
      this.isAbstract = false;
      return this;
   }
   
   datatype(): ClassBuilder {
      this._stereotype = DATATYPE;
      this.restrictedTo = [ Nature.ABSTRACT ];
      this.isAbstract = false;
      return this;
   }
   
   abstractClass(): ClassBuilder {
      this._stereotype = ABSTRACT;
      this.restrictedTo = [ Nature.ABSTRACT ];
      this.isAbstract = false;
      return this;
   }

   type(): ClassBuilder {
      this._stereotype = TYPE;
      this.restrictedTo = [ Nature.TYPE ];
      this.isAbstract = false;
      return this;
   }
   
}

