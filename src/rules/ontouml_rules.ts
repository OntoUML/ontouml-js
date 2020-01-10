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
  private _version: string;

  constructor(version?: string) {
    const ontoUMLRules = {
      '1.0': OntoUMLv1,
      '2.0': OntoUMLv2,
    };

    this._stereotypes = ontoUMLRules[version || '1.0'].STEREOTYPES;
    this._version = version || '1.0';

    this.getStereotypesID = memoizee(this.getStereotypesID);
    this.getSpecializationsConstraints = memoizee(
      this.getSpecializationsConstraints,
    );
  }

  getVersion(): string {
    return this._version;
  }

  getStereotypeNameByID(stereotypeId: string): string {
    return this._stereotypes.filter(
      (stereotype: IStereotype) => stereotype.id === stereotypeId,
    )[0].name;
  }

  getStereotypesID(filters?: IFilter): string[] {
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
      .map((stereotype: IStereotype) => stereotype.id);
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

      specializationsConstraints[stereotype.id] = stereotype.specializes;
    }

    return specializationsConstraints;
  }

  isValidSpecialization(
    stereotypeId: string,
    parentStereotypeId: string,
  ): boolean {
    const stereotype = this._stereotypes.filter(
      (stereotype: IStereotype) => stereotype.id === stereotypeId,
    )[0];

    return stereotype
      ? stereotype.specializes.includes(parentStereotypeId)
      : false;
  }
}

export default OntoUMLRules;
