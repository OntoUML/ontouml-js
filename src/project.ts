import {
  ClassStereotype,
  OntologicalNature,
  PropertyStereotype,
  RelationStereotype,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  Package,
  Property,
  Relation,
  OntoumlElement,
  OntoumlType,
  Diagram,
  ClassView,
  BinaryRelationView,
  GeneralizationView,
  GeneralizationSetView
} from '.';
import { Rectangle } from './shape/rectangle';
import { Path } from './shape/path';
import { Text } from './shape/text';
import { PackageView } from './view/package_view';
import { NamedElement } from './named_element';
import { Finder } from './finder';
import { Note } from './model/note';
import { NoteView } from './view/note_view';
import { NoteLink } from './model/note_link';

export class Project extends NamedElement {
  finder: Finder;
  root?: Package;
  
  private _classes: {[key: string]: Class}
  private _relations: {[key: string]: Relation}
  private _generalizations: {[key: string]: Generalization}
  private _generalizationSets: {[key: string]: GeneralizationSet}
  private _packages: {[key: string]: Package}
  private _properties: {[key: string]: Property}
  private _literals: {[key: string]: Literal}
  private _notes: {[key: string]: Note}
  private _noteLinks: {[key: string]: NoteLink}
  private _diagrams: {[key: string]: Diagram}
  private _classViews: {[key: string]: ClassView}
  private _binaryRelationViews: {[key: string]: BinaryRelationView}
  private _nAryRelationViews: {[key: string]: NaryRelationView}
  private _generalizationViews: {[key: string]: GeneralizationView}
  private _generalizationSetViews: {[key: string]: GeneralizationSetView}
  private _packageViews: {[key: string]: PackageView}
  private _noteViews: {[key: string]: NoteView}

  constructor() {
    super();

    this.project = this;
    this._classes = {};
    this._relations = {};
    this._generalizations = {};
    this._generalizationSets = {};
    this._packages = {};
    this._properties = {};
    this._literals = {};
    this._notes = {};
    this._noteLinks = {};
    this._diagrams = {};
    this._classViews = {};
    this._binaryRelationViews = {};
    this._nAryRelationViews = {};
    this._generalizationViews = {};
    this._generalizationSetViews = {};
    this._packageViews = {};
    this._noteViews ={};

    this.finder = new Finder(this);
  }

  createModel(base?: Partial<Package>): Package {
    if (this.model) {
      throw new Error('Model already defined');
    }

    // TODO: Should the container of the model be the project?
    this.model = new Package(base);
    this.setProject(this);

    return this.model;
  }

  setModel(pkg: Package): void {
    this.model = pkg;
    if (pkg != null) {
      this.model.setContainer(this);
    }
  }

  createDiagram(base?: Partial<Diagram>): Diagram {
    if (!this.diagrams) {
      this.diagrams = [];
    }

    const diagram = new Diagram({ ...base });
    this.diagrams.push(diagram);
    return diagram;
  }

  addDiagram(diagram: Diagram) {
    if (diagram === null) return;

    diagram.setContainer(this);
    this.diagrams.push(diagram);
  }

  addDiagrams(diagrams: Diagram[]) {
    if (diagrams === null) return;

    diagrams.forEach(d => this.addDiagram(d));
  }

  setDiagrams(diagrams: Diagram[]) {
    this.diagrams = [];

    if (diagrams === null) return;

    this.addDiagrams(diagrams);
  }

  getContents(): OntoumlElement[] {
    let contents: OntoumlElement[] = [];

    if (this.model) {
      contents.push(this.model);
    }

    if (this.diagrams) {
      contents = [...contents, ...this.diagrams];
    }

    return contents;
  }
 

  override toJSON(): any {
    const object = {
      type: OntoumlType.PROJECT,
      root: this.root || null,
      elements: null
    };

    return { ...object, ...super.toJSON() };
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}

  clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }

  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }

}
