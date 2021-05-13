import { OntoumlElement, Class, ClassStereotype, Relation, Generalization, Cardinality } from '@libs/ontouml';

export function getNameNoSpaces(element: OntoumlElement) {
	return element.getName().replace(/\s/g, '');
}

export function isTopLevel(_class: Class, generalizations: Generalization[]) {
	for (const gen of generalizations) {
		if (gen.involvesClasses() && gen.getSpecificClass() == _class) {
			return false;
		}
	}
	return true;
}

export function getCardinalityKeyword(cardinality: Cardinality) {
	if (cardinality.isBounded()) {
		if (cardinality.isZeroToOne()) {
			return 'lone';
		} else if (cardinality.isOneToOne()) {
			return 'one';
		} else if (cardinality.isZeroToMany()) {
			return 'set';
		} else if (cardinality.isOneToMany()) {
			return 'some';
		}
	}
	return '';
}

export function isCustomCardinality(cardinality: Cardinality) {
	if (cardinality.isZeroToOne() || cardinality.isOneToOne() || cardinality.isZeroToMany() || cardinality.isOneToMany()) {
		return false;
	}
	return true;
}

export function getCustomCardinality(cardinality: Cardinality) {
	let lowerBound = null;
	let upperBound = null;

	if (!cardinality.isLowerBoundValid()) {	// ! is being used because this method is returning the opposite of what it should
		lowerBound = cardinality.lowerBound
	}

	if (!cardinality.isUpperBoundValid()) { // ! is being used because this method is returning the opposite of what it should
		upperBound = cardinality.upperBound
	}

	return [lowerBound, upperBound];
}

export function getValidAlias(element: OntoumlElement, name: string, aliases: [OntoumlElement, string][]) {
	const foundAlias = aliases.find((a) => { return a[0] === element; })
	if (foundAlias) {
		return foundAlias[1];
	} else {
		let i = 1;
		while (aliases.some((a) => { return a[1] === name + i; })) {
			i++;
		}
		aliases.push([element, name + i]);
		return name + i;
	}
}

export function isMaterialConnectedToDerivation(material: Relation, relations: Relation[]) {
	if (material.hasMaterialStereotype()) {
		for (const rel of relations) {
			if (rel.hasDerivationStereotype() && rel.getDerivingRelation() === material
				&& rel.getDerivedClassStereotype() === ClassStereotype.RELATOR) {
					return true;
			}
		}
	}
	return false;
}

export function holdsBetweenDatatypes(relation: Relation) {
	if (relation.getSourceStereotype() === ClassStereotype.DATATYPE
		&& relation.getTargetStereotype() === ClassStereotype.DATATYPE) {
		
		return true;
	}
	return false;
}

export function getCorrespondingDatatype(datatypeName: string, datatypes: [string, string[]][]) {
	for (const datatype of datatypes) {
		if (datatype[0] === datatypeName) {
			return datatype;
		}
	}
	return null;
}
