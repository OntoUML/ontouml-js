import _ from 'lodash';
import { OntoumlElement, Project, NamedElement, ProjectElement } from '..';

export abstract class ModelElement
  extends NamedElement
  implements ProjectElement
{
  _project: Project;
  _container?: ModelElement;
  customProperties: object = {};

  constructor(project: Project) {
    super();
    this._project = project;
  }

  get contents(): ModelElement[] {
    return [];
  }

  override getContents(): OntoumlElement[] {
    return this.contents;
  }

  get project(): Project {
    return this._project;
  }

  set project(value: Project) {
    this._project = value;
    this.contents.forEach(me => (me.project = value));
  }

  get container(): ModelElement | undefined {
    return this._container;
  }

  set container(newContainer: ModelElement | undefined) {
    this._container = newContainer;

    if (newContainer?.project) {
      this.project = newContainer.project;
    }
  }

  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {
    // TODO: resolve references within propertyAssignments
  }

  override toJSON(): any {
    const object = {
      customProperties: !_.isEmpty(this.customProperties)
        ? this.customProperties
        : null
    };

    return { ...super.toJSON(), ...object };
  }
}
