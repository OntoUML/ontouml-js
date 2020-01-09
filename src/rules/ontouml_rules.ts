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
  private _relations: IRelation[];
  private _version: string;

  constructor(version?: string) {
    const ontoUMLRules = {
      '1.0': OntoUMLv1,
      '2.0': OntoUMLv2,
    };

    this._stereotypes = ontoUMLRules[version || '1.0'].STEREOTYPES;
    this._relations = ontoUMLRules[version || '1.0'].RELATIONS;
    this._version = version || '1.0';

    this.getStereotypesURI = memoizee(this.getStereotypesURI);
    this.getSpecializationsConstraints = memoizee(
      this.getSpecializationsConstraints,
    );
  }

  getVersion(): string {
    return this._version;
  }

  getStereotype(stereotypeUri: string): IStereotype {
    return this._stereotypes.filter(
      (stereotype: IStereotype) => stereotype.uri === stereotypeUri,
    )[0];
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

  getRelationStereotype(relationStereotypeUri: string): IRelation {
    return this._relations.filter(
      (releation: IRelation) => relationStereotypeUri === releation.uri,
    )[0];
  }

  getRelationStereotypesURI(): string[] {
    return this._relations.map((releation: IRelation) => releation.uri);
  }

  getRelationNameByURI(relationUri: string): string {
    return this._relations.filter(
      (relation: IRelation) => relation.uri === relationUri,
    )[0].name;
  }

  getRelationCardinalityValue(value: string | number): number {
    if (value === '*') {
      return 99999;
    }

    if (typeof value === 'string') {
      return Number(value);
    }

    return value;
  }

  isDerivationRelation(relationUri: string): boolean {
    const derivationUri = this._relations.filter(
      ({ name }: IRelation) => name === '«derivation»',
    )[0].uri;

    return derivationUri === relationUri;
  }

  isValidRelation(
    sourceStereotypeUri: string,
    targetStereotypeUri: string,
    relationStereotypeUri: string,
  ): boolean {
    const sourceStereotype = this.getStereotype(sourceStereotypeUri);

    return sourceStereotype.relations[targetStereotypeUri].includes(
      relationStereotypeUri,
    );
  }
}

export default OntoUMLRules;
