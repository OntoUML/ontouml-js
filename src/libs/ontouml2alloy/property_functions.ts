import { Property, Class, Relation } from '@libs/ontouml';
import { Ontouml2Alloy } from '.';
import {
	getNormalizedName,
	getCardinalityKeyword,
	isCustomCardinality,
	getCustomCardinality,
	getAlias,
	isMaterialConnectedToDerivation,
	holdsBetweenDatatypes,
	getCorrespondingDatatype
} from './util';

export function transformProperty(transformer: Ontouml2Alloy, property: Property) {
	if (property.container instanceof Class && property.container.hasDatatypeStereotype()) {
		transformDatatypeAttribute(transformer, property);
		return;
	} else if (property.container instanceof Relation && holdsBetweenDatatypes(property.container)) {
		return;
	}

	if (property.isAttribute()) {
		if (property.isOrdered) {
			transformOrderedAttribute(transformer, property);
		} else {
			transformGeneralAttribute(transformer, property);
		}
	} else if (property.isRelationEnd()) {
		if (property.container instanceof Relation && property.container.hasDerivationStereotype()) {
			return;
		}

		if (property.container instanceof Relation && property.container.getSourceEnd() === property) {
			transformRelationSourceEnd(transformer, property);
		} else {
			transformRelationTargetEnd(transformer, property);
		}
	}
}

function transformOrderedAttribute(transformer: Ontouml2Alloy, attribute: Property) {
	const attributeName = getNormalizedName(transformer, attribute);
	const ownerClassName = getNormalizedName(transformer, attribute.container);
	const datatypeName = getNormalizedName(transformer, attribute.propertyType);
	const funAlias = getAlias(attribute, attributeName, transformer.aliases);
	const cardinality = getCardinalityKeyword(attribute.cardinality);

	transformer.addWorldFieldDeclaration(
		(attributeName + ': set ' + ownerClassName + ' set -> set Int set -> ' + cardinality + ' ' + datatypeName).replace(/\s{2,}/g, ' ')
	);

	transformer.addFact(
		'fact ordering {\n' +
		'        all w: World, x: w.' + ownerClassName + ' | isSeq[x.(w.' + attributeName + ')]\n' +
		'        all w: World, x: w.' + ownerClassName + ', y: w.' + ownerClassName + ' | lone x.((w.' + attributeName + ').y)\n' +
		'}'
	);

	transformer.addFun(
		'fun ' + funAlias + ' [x: World.' + ownerClassName + ', w: World] : set ' + datatypeName + ' {\n' +
		'        x.(w.' + attributeName + ')\n' +
		'}'
	);

	if (attribute.isReadOnly) {
		transformer.addRelationPropertiesFact(
			'immutable_target[' + ownerClassName + ',' + attributeName + ']'
		);
	}

	if (isCustomCardinality(attribute.cardinality)) {
		const [lowerBound, upperBound] = getCustomCardinality(attribute.cardinality);

		if (lowerBound && upperBound) {
			if (lowerBound === upperBound) {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]=' + lowerBound + '\n' +
					'}'
				);
			} else {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]>=' + lowerBound + ' and #' + funAlias + '[x,w]<=' + upperBound + '\n' +
					'}'
				);
			}
		} else if (lowerBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]>=' + lowerBound + '\n' +
				'}'
			);
		} else if (upperBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]<=' + upperBound + '\n' +
				'}'
			);
		}
	}

	transformer.addVisible(
		'select13[' + attributeName + ']'
	);
}

function transformGeneralAttribute(transformer: Ontouml2Alloy, attribute: Property) {
	const attributeName = getNormalizedName(transformer, attribute);
	const ownerClassName = getNormalizedName(transformer, attribute.container);
	const datatypeName = getNormalizedName(transformer, attribute.propertyType);
	const cardinality = getCardinalityKeyword(attribute.cardinality);
	const funAlias = getAlias(attribute, attributeName, transformer.aliases);

	transformer.addWorldFieldDeclaration(
		(attributeName + ': set ' + ownerClassName + ' set -> ' + cardinality + ' ' + datatypeName).replace(/\s{2,}/g, ' ')
	);

	transformer.addFun(
		'fun ' + funAlias + ' [x: World.' + ownerClassName + ', w: World] : set ' + datatypeName + ' {\n' +
		'        x.(w.' + attributeName + ')\n' +
		'}'
	);

	if (attribute.isReadOnly) {
		transformer.addRelationPropertiesFact(
			'immutable_target[' + ownerClassName + ',' + attributeName + ']'
		);
	}

	if (isCustomCardinality(attribute.cardinality)) {
		const [lowerBound, upperBound] = getCustomCardinality(attribute.cardinality);

		if (lowerBound && upperBound) {
			if (lowerBound === upperBound) {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]=' + lowerBound + '\n' +
					'}'
				);
			} else {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]>=' + lowerBound + ' and #' + funAlias + '[x,w]<=' + upperBound + '\n' +
					'}'
				);
			}
			
		} else if (lowerBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]>=' + lowerBound + '\n' +
				'}'
			);
		} else if (upperBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + ownerClassName + ' | #' + funAlias + '[x,w]<=' + upperBound + '\n' +
				'}'
			);
		}
	}

	transformer.addVisible(
		'select13[' + attributeName + ']'
	);
}

function transformRelationSourceEnd(transformer: Ontouml2Alloy, sourceEnd: Property) {
	let relationName = getNormalizedName(transformer, sourceEnd.container);

	const sourceName = getNormalizedName(transformer, (sourceEnd.container as Relation).getSource());
	let sourceEndName = '';

	if (sourceEnd.getName()) {
		sourceEndName = getNormalizedName(transformer, sourceEnd);
	} else {
		sourceEndName = sourceName;
	}

	const oppositeName = getNormalizedName(transformer, (sourceEnd.container as Relation).getTarget());
	const sourceEndAlias = getAlias(sourceEnd, sourceEndName, transformer.aliases);

	if (isMaterialConnectedToDerivation(sourceEnd.container as Relation, transformer.model.getAllRelations())
		|| sourceEnd.isOrdered || sourceEnd.getOppositeEnd().isOrdered) {
		transformer.addFun(
			'fun ' + sourceEndAlias + ' [x: World.' + oppositeName + ', w: World] : set World.' + sourceName + ' {\n' +
			'        (select13[w.' + relationName + ']).x\n' +
			'}'
		);
	} else {
		transformer.addFun(
			'fun ' + sourceEndAlias + ' [x: World.' + oppositeName + ', w: World] : set World.' + sourceName + ' {\n' +
			'        (w.' + relationName + ').x\n' +
			'}'
		);
	}

	if (sourceEnd.isReadOnly) {
		transformer.addRelationPropertiesFact(
			'immutable_source[' + oppositeName + ',' + relationName + ']'
		);
	}

	if (isCustomCardinality(sourceEnd.cardinality)
		|| isMaterialConnectedToDerivation((sourceEnd.container as Relation), transformer.model.getAllRelations())) {

		const [lowerBound, upperBound] = getCustomCardinality(sourceEnd.cardinality);

		if (lowerBound && upperBound) {
			if (lowerBound === upperBound) {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + oppositeName + ' | #' + sourceEndAlias + '[x,w]=' + lowerBound + '\n' +
					'}'
				);
			} else {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + oppositeName + ' | #' + sourceEndAlias + '[x,w]>=' + lowerBound + ' and #' + sourceEndAlias + '[x,w]<=' + upperBound + '\n' +
					'}'
				);
			}
		} else if (lowerBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + oppositeName + ' | #' + sourceEndAlias + '[x,w]>=' + lowerBound + '\n' +
				'}'
			);
		} else if (upperBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + oppositeName + ' | #' + sourceEndAlias + '[x,w]<=' + upperBound + '\n' +
				'}'
			);
		}
	}
}

function transformRelationTargetEnd(transformer: Ontouml2Alloy, targetEnd: Property) {
	let relationName = getNormalizedName(transformer, targetEnd.container);

	const targetName = getNormalizedName(transformer, (targetEnd.container as Relation).getTarget());
	let targetEndName = '';

	if (targetEnd.getName()) {
		targetEndName = getNormalizedName(transformer, targetEnd);
	} else {
		targetEndName = targetName;
	}

	const oppositeName = getNormalizedName(transformer, (targetEnd.container as Relation).getSource());
	const targetEndAlias = getAlias(targetEnd, targetEndName, transformer.aliases);

	if (isMaterialConnectedToDerivation(targetEnd.container as Relation, transformer.model.getAllRelations())
		|| targetEnd.isOrdered || targetEnd.getOppositeEnd().isOrdered) {
		transformer.addFun(
			'fun ' + targetEndAlias + ' [x: World.' + oppositeName + ', w: World] : set World.' + targetName + ' {\n' +
			'        x.(select13[w.' + relationName + '])\n' +
			'}'
		);
	} else {
		transformer.addFun(
			'fun ' + targetEndAlias + ' [x: World.' + oppositeName + ', w: World] : set World.' + targetName + ' {\n' +
			'        x.(w.' + relationName + ')\n' +
			'}'
		);
	}

	if (targetEnd.isReadOnly || (targetEnd.container as Relation).hasMediationStereotype()
		|| (targetEnd.container as Relation).hasCharacterizationStereotype()) {

		transformer.addRelationPropertiesFact(
			'immutable_target[' + oppositeName + ',' + relationName + ']'
		);
	}

	if (isCustomCardinality(targetEnd.cardinality)
		|| isMaterialConnectedToDerivation((targetEnd.container as Relation), transformer.model.getAllRelations())) {

		const [lowerBound, upperBound] = getCustomCardinality(targetEnd.cardinality);

		if (lowerBound && upperBound) {
			if (lowerBound === upperBound) {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + oppositeName + ' | #' + targetEndAlias + '[x,w]=' + lowerBound + '\n' +
					'}'
				);
			} else {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all w: World, x: w.' + oppositeName + ' | #' + targetEndAlias + '[x,w]>=' + lowerBound + ' and #' + targetEndAlias + '[x,w]<=' + upperBound + '\n' +
					'}'
				);
			}
		} else if (lowerBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + oppositeName + ' | #' + targetEndAlias + '[x,w]>=' + lowerBound + '\n' +
				'}'
			);
		} else if (upperBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all w: World, x: w.' + oppositeName + ' | #' + targetEndAlias + '[x,w]<=' + upperBound + '\n' +
				'}'
			);
		}
	}
}

function transformDatatypeAttribute(transformer: Ontouml2Alloy, attribute: Property) {
	const attributeName = getNormalizedName(transformer, attribute);
	const ownerDatatypeName = getNormalizedName(transformer, attribute.container);
	const ownerDatatype = getCorrespondingDatatype(ownerDatatypeName, transformer.datatypes);
	const cardinality = getCardinalityKeyword(attribute.cardinality);
	const datatypeName = getNormalizedName(transformer, attribute.propertyType);

	ownerDatatype[1].push((attributeName + ': ' + cardinality + ' ' + datatypeName).replace(/\s{2,}/g, ' '));

	if (isCustomCardinality(attribute.cardinality)) {
		const [lowerBound, upperBound] = getCustomCardinality(attribute.cardinality);

		if (lowerBound && upperBound) {
			if (lowerBound === upperBound) {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all x: ' + ownerDatatype[0] + ' | #x.' + attributeName + '=' + lowerBound + '\n' +
					'}'
				);
			} else {
				transformer.addFact(
					'fact multiplicity {\n' +
					'        all x: ' + ownerDatatype[0] + ' | #x.' + attributeName + '>=' + lowerBound + ' and #x.' + attributeName + '<=' + upperBound + '\n' +
					'}'
				);
			}
		} else if (lowerBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all x: ' + ownerDatatype[0] + ' | #x.' + attributeName + '>=' + lowerBound + '\n' +
				'}'
			);
		} else if (upperBound) {
			transformer.addFact(
				'fact multiplicity {\n' +
				'        all x: ' + ownerDatatype[0] + ' | #x.' + attributeName + '<=' + upperBound + '\n' +
				'}'
			);
		}
	}
}
