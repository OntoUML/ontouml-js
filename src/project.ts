import {
  Generalization,
  GeneralizationSet,
  Literal,
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
import { NamedElement } from './named_element';
import { Finder } from './finder';
import { Class } from './model/class';
import { Note } from './model/note';
import { NoteLink } from './model/note_link';
import { PackageView } from './view/package_view';
import { NoteView } from './view/note_view';
import { NaryRelationView } from './view/nary_relation_view';
import { NoteLinkView } from './view/note_link_view';
import { ClassBuilder } from './builder/class_builder';

export class Project extends NamedElement {
  finder: Finder;
  root?: Package;
  
  private _classes: {[key: string]: Class} = {}
  private _relations: {[key: string]: Relation} = {}
  private _generalizations: {[key: string]: Generalization} = {}
  private _generalizationSets: {[key: string]: GeneralizationSet} = {}
  private _packages: {[key: string]: Package} = {}
  private _properties: {[key: string]: Property} = {}
  private _literals: {[key: string]: Literal} = {}
  private _notes: {[key: string]: Note} = {}
  private _noteLinks: {[key: string]: NoteLink} = {}
  private _diagrams: {[key: string]: Diagram} = {}
  private _classViews: {[key: string]: ClassView} = {}
  private _binaryRelationViews: {[key: string]: BinaryRelationView} = {}
  private _nAryRelationViews: {[key: string]: NaryRelationView} = {}
  private _generalizationViews: {[key: string]: GeneralizationView} = {}
  private _generalizationSetViews: {[key: string]: GeneralizationSetView} = {}
  private _packageViews: {[key: string]: PackageView} = {}
  private _noteViews: {[key: string]: NoteView} = {}
  private _noteLinkViews: {[key: string]: NoteLinkView} = {}

  constructor() {
    super();

    this.finder = new Finder(this);
  }

  // createModel(base?: Partial<Package>): Package {
  //   if (this.model) {
  //     throw new Error('Model already defined');
  //   }

  //   // TODO: Should the container of the model be the project?
  //   this.model = new Package(base);
  //   this.setProject(this);

  //   return this.model;
  // }

  // setModel(pkg: Package): void {
  //   this.model = pkg;
  //   if (pkg != null) {
  //     this.model.setContainer(this);
  //   }
  // }

  classBuilder(): ClassBuilder {
    return new ClassBuilder(this);
  }

  addClass(c: Class): void {
    this._classes[c.id] = c;
  }

  createDiagram(): Diagram {
    const diagram = new Diagram(this);
    this.addDiagram(diagram);
    return diagram;
  }

  addDiagram(diagram: Diagram) {
    if (diagram === null) return;
    
    this._diagrams[diagram.id] = diagram;
  }

  addDiagrams(diagrams: Diagram[]) {
    if (diagrams === null) return;

    diagrams.forEach(d => this.addDiagram(d));
  }

  setDiagrams(diagrams: Diagram[]) {
    this._diagrams = {};

    if (diagrams === null) return;

    this.addDiagrams(diagrams);
  }

  getContents(): OntoumlElement[] {
    console.log(this._classes);
    return ([
      ...Object.values(this._classes),
      // ...Object.values(this._relations),
      // ...Object.values(this._generalizations),
      // ...Object.values(this._generalizationSets),
      // ...Object.values(this._packages),
      // ...Object.values(this._properties),
      // ...Object.values(this._literals),
      // ...Object.values(this._notes),
      // ...Object.values(this._noteLinks),
      // ...Object.values(this._diagrams),
      // ...Object.values(this._classViews),
      // ...Object.values(this._binaryRelationViews),
      // ...Object.values(this._nAryRelationViews),
      // ...Object.values(this._generalizationViews),
      // ...Object.values(this._generalizationSetViews),
      // ...Object.values(this._packageViews),
      // ...Object.values(this._noteViews),
      // ...Object.values(this._noteLinkViews),
    ]);

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
