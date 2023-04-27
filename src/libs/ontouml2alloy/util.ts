import { OntoumlElement, Class, ClassStereotype, Relation, Generalization, Cardinality } from '@libs/ontouml';
import { Ontouml2Alloy } from '.';

//TODO multi-language support
export function normalizeName(transformer: Ontouml2Alloy, element: OntoumlElement) {

	if(element.id in transformer.normalizedNames){
		return transformer.normalizedNames[element.id];
	}

	const reservedKeywords = [
        'abstract', 'all', 'and', 'as', 'assert',
        'but', 'check', 'disj', 'else', 'exactly',
        'extends', 'fact', 'for', 'fun', 'iden',
        'iff', 'implies', 'in', 'Int', 'let',
        'lone', 'module', 'no', 'none', 'not',
        'one', 'open', 'or', 'pred', 'run',
        'set', 'sig', 'some', 'sum', 'univ'
    ];

    const forbiddenCharacters = [
        ' ', '!', '@', '#', '$', '%', '&',
        '*', '(', ')', '-', '+', '=', '{',
        '}', '[', ']', '|', '\\', ';', ':',
        ',', '.', '<', '>', '/', '?'
    ];

    let normalizedName = element.getName();

    //Replace forbidden characters with an empty string
    forbiddenCharacters.forEach(char => {
        normalizedName = normalizedName.replace(new RegExp(`\\${char}`, 'g'), '');
    });

	//Check if the name is an empty string, if so, replace it with 'Unnamed'
	if(normalizedName == ''){
		normalizedName = 'Unnamed';
	}

	//Check if the normalized name is a reserved keyword or 'Unnamed', if so, add the type of ontouml element to the name
	if (reservedKeywords.includes(normalizedName) || normalizedName == 'Unnamed' ) {
		normalizedName += `_${(element.type).toLowerCase()}`;
	}

	//Check if the normalized name starts with a number, and change it if so
	if (normalizedName.match(/^[0-9]/)) {
		normalizedName = `${(element.type).toLowerCase()}_${normalizedName}`;
	}

	//Check if the normalized name is already in use, and change it if so
	const id = element.id;
	if(Object.values(transformer.normalizedNames).length != 0){
		const existingNames = Object.values(transformer.normalizedNames);
		let index = 1;
		while (existingNames.includes(normalizedName)) {
			normalizedName = `${normalizedName}${index}`;
			index++;
		}
	}

    transformer.normalizedNames[id] = normalizedName;

	return normalizedName;
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
