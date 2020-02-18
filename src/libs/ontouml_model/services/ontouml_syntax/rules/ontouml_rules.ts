// import memoizee from 'memoizee';
// import * as OntoUMLv1 from './1.0/ontouml';
// import * as OntoUMLv2 from './2.0/ontouml';

// interface IFilter {
//   rigidity?: string;
//   sortality?: string;
//   ultimateSortal?: boolean;
// }

// class OntoUMLRules {
//   private stereotypes: IStereotype[];
//   private relations: IRelation[];
//   private version: string;

//   constructor(version?: string) {
//     const ontoUMLRules = {
//       '1.0': OntoUMLv1,
//       '2.0': OntoUMLv2,
//     };

//     this.stereotypes = ontoUMLRules[version || '1.0'].STEREOTYPES;
//     this.relations = ontoUMLRules[version || '1.0'].RELATIONS;
//     this.version = version || '1.0';

//     this.getStereotypesID = memoizee(this.getStereotypesID);
//     this.getSpecializationsConstraints = memoizee(
//       this.getSpecializationsConstraints,
//     );
//   }

//   getVersion(): string {
//     return this.version;
//   }

//   getStereotype(stereotypeId: string): IStereotype {
//     return this.stereotypes.filter(
//       (stereotype: IStereotype) => stereotype.id === stereotypeId,
//     )[0];
//   }

//   getStereotypeNameByID(stereotypeId: string): string {
//     const stereotype = this.stereotypes.filter(
//       (stereotype: IStereotype) => stereotype.id === stereotypeId,
//     )[0];

//     return stereotype ? stereotype.name : '';
//   }

//   getStereotypesID(filters?: IFilter): string[] {
//     return this.stereotypes
//       .filter((stereotype: IStereotype) => {
//         let contains = true;

//         if (filters) {
//           for (const key of Object.keys(filters)) {
//             contains = contains && filters[key] === stereotype[key];
//           }
//         }

//         return contains;
//       })
//       .map((stereotype: IStereotype) => stereotype.id);
//   }

//   getStereotypesName(filters?: IFilter): string[] {
//     return this.stereotypes
//       .filter((stereotype: IStereotype) => {
//         let contains = true;

//         if (filters) {
//           for (const key of Object.keys(filters)) {
//             contains = contains && filters[key] === stereotype[key];
//           }
//         }

//         return contains;
//       })
//       .map((stereotype: IStereotype) => stereotype.name);
//   }

//   getSpecializationsConstraints(): object {
//     const specializationsConstraints = {};
//     const stereotypes = this.stereotypes;

//     for (let i = 0; i < stereotypes.length; i += 1) {
//       const stereotype = stereotypes[1];

//       specializationsConstraints[stereotype.id] = stereotype.specializes;
//     }

//     return specializationsConstraints;
//   }

//   isValidSpecialization(
//     stereotypeId: string,
//     parentStereotypeId: string,
//   ): boolean {
//     const stereotype = this.stereotypes.filter(
//       (stereotype: IStereotype) => stereotype.id === stereotypeId,
//     )[0];

//     return stereotype
//       ? stereotype.specializes.includes(parentStereotypeId)
//       : false;
//   }

//   getRelationStereotype(relationStereotypeId: string): IRelation {
//     return this.relations.filter(
//       (releation: IRelation) => relationStereotypeId === releation.id,
//     )[0];
//   }

//   getRelationStereotypesID(): string[] {
//     return this.relations.map((releation: IRelation) => releation.id);
//   }

//   getRelationNameByID(relationId: string): string {
//     return this.relations.filter(
//       (relation: IRelation) => relation.id === relationId,
//     )[0].name;
//   }

//   getRelationCardinalityValue(value: string | number): number {
//     if (value === '*') {
//       return 99999;
//     }

//     if (typeof value === 'string') {
//       return Number(value);
//     }

//     return value;
//   }

//   isDerivationRelation(relationId: string): boolean {
//     const derivationId = this.relations.filter(
//       ({ name }: IRelation) => name === '«derivation»',
//     )[0].id;

//     return derivationId === relationId;
//   }

//   isValidRelation(
//     sourceStereotypeId: string,
//     targetStereotypeId: string,
//     relationStereotypeId: string,
//   ): boolean {
//     const sourceStereotype =
//       this.getStereotype(sourceStereotypeId) ||
//       this.getRelationStereotype(sourceStereotypeId);
//     const relation = sourceStereotype.relations[targetStereotypeId];

//     return relation && relation.includes(relationStereotypeId);
//   }
// }

// export default OntoUMLRules;
