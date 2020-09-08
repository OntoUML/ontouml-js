import { Class } from './Class';
import { OntoUMLType, ClassStereotype, RelationStereotype } from '@constants/.';

let c1, c2;
c1 = new Class({ name: 'Person' });
c2 = new Class({ name: 'Student', stereotype: [ClassStereotype.ROLE] });
c2 = new Class('Student', ClassStereotype.ROLE);

let p = new Project();
let pkg1 = p.addPackage('Domain');
let pkg2 = pkg1.addPackage(null, { description: { ita: 'Un pacchetto' } });
let pkg3 = pkg1.addPackage();

let c1, c2, c3, c4;
c1 = pkg1.addClass('Person', ClassStereotype.KIND);
c2 = pkg1.addClass('Organization', ClassStereotype.KIND);
c3 = pkg1.addClass('Agent', ClassStereotype.CATEGORY);
c4 = pkg1.addClass('string', ClassStereotype.DATATYPE);

let gen1 = pkg1.addGeneralization(c1, c3);

let rel1 = pkg1.addRelation(c1, c2, 'owns', RelationStereotype.MATERIAL);

c1.createAttribute('name', c4); // c1.createAttribute("name",c4, PropertyStereotype.BEGIN)
let att = c1.addAttribute('surname', c4); // c1.createAttribute("name",c4, PropertyStereotype.BEGIN)

let gs = pkg1.addGeneralizationSet(
  [gen1],
  'Person by Property',
  false,
  false,
  categorizer,
);

pkg1.addMediation('involves', c1, c2); // with verification
pkg1.addComparative('involves', c1, c2, c3, c4, c5); // with verification
pkg1.addSubkind('Man');
pkg1.addGeneralizationSet(true, true, general, specific1, specific2, specific3);
