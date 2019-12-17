import memoizee from 'memoizee';
import * as OntoUMLv1 from './1.0/ontouml';
import * as OntoUMLv2 from './2.0/ontouml';

interface IFilter {
  rigidity?: string;
  sortality?: string;
  ultimateSortal?: boolean;
}

class OntoUMLRules {
  private _stereotypes: IStereotype[];
  private _relationships: IRelationship[];
  private _version: string;

  constructor(version?: string) {
    const ontoUMLRules = {
      '1.0': OntoUMLv1,
      '2.0': OntoUMLv2,
    };

    this._stereotypes = ontoUMLRules[version || '1.0'].STEREOTYPES;
    this._relationships = ontoUMLRules[version || '1.0'].RELATIONSHIPS;
    this._version = version || '1.0';

    this.getStereotypesURI = memoizee(this.getStereotypesURI);
    this.getSpecializationsConstraints = memoizee(
      this.getSpecializationsConstraints,
    );
  }

  getVersion(): string {
    return this._version;
  }

  getStereotypeNameByURI(stereotypeUri: string): string {
    return this._stereotypes.filter(
      (stereotype: IStereotype) => stereotype.uri === stereotypeUri,
    )[0].name;
  }

  getStereotypesURI(filters?: IFilter): string[] {
    return this._stereotypes
      .filter((stereotype: IStereotype) => {
        let contains = true;

        if (filters) {
          for (const key of Object.keys(filters)) {
            contains = contains && filters[key] === stereotype[key];
          }
        }

        return contains;
      })
      .map((stereotype: IStereotype) => stereotype.uri);
  }

  getStereotypesName(filters?: IFilter): string[] {
    return this._stereotypes
      .filter((stereotype: IStereotype) => {
        let contains = true;

        if (filters) {
          for (const key of Object.keys(filters)) {
            contains = contains && filters[key] === stereotype[key];
          }
        }

        return contains;
      })
      .map((stereotype: IStereotype) => stereotype.name);
  }

  getSpecializationsConstraints(): object {
    const specializationsConstraints = {};
    const stereotypes = this._stereotypes;

    for (let i = 0; i < stereotypes.length; i += 1) {
      const stereotype = stereotypes[1];

      specializationsConstraints[stereotype.uri] = stereotype.specializes;
    }

    return specializationsConstraints;
  }

  isValidSpecialization(
    stereotypeUri: string,
    parentStereotypeUri: string,
  ): boolean {
    const stereotype = this._stereotypes.filter(
      (stereotype: IStereotype) => stereotype.uri === stereotypeUri,
    )[0];

    return stereotype
      ? stereotype.specializes.includes(parentStereotypeUri)
      : false;
  }

  getRelationshipNameByURI(relationshipUri: string): string {
    return this._relationships.filter(
      (relationship: IRelationship) => relationship.uri === relationshipUri,
    )[0].name;
  }
}

export default OntoUMLRules;
