import { ClassStereotype, Relation, RelationStereotype } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import {
	getNormalizedName,
	getCardinalityKeyword,
	getCustomCardinality,
	holdsBetweenDatatypes,
	getCorrespondingDatatype,
	getAlias
} from './util';

export function transformRelation(transformer: Ontouml2Alloy, relation: Relation) {
	if (holdsBetweenDatatypes(relation)) {
		transformDatatypeRelation(transformer, relation);
		return;
	}
	
	if (relation.hasDerivationStereotype()) {
		transformDerivationRelation(transformer, relation);
		return;
	}

	if (relation.hasMediationStereotype()) {
		transformMediationRelation(transformer, relation);
		return;
	}

	if (relation.hasMaterialStereotype()) {
		transformMaterialRelation(transformer, relation);
		return;
	}

	if (relation.isPartWholeRelation() || relation.hasComponentOfStereotype() || relation.hasMemberOfStereotype()
		|| relation.hasSubCollectionOfStereotype() || relation.hasSubQuantityOfStereotype()) {
		
		transformPartWholeRelation(transformer, relation);
		return;
	}

	transformGeneralRelation(transformer, relation);
}

function transformOrderedRelation(transformer: Ontouml2Alloy, relation: Relation) {
	let relationName = getNormalizedName(transformer, relation);

	const sourceName = getNormalizedName(transformer, relation.getSource());
	const targetName = getNormalizedName(transformer, relation.getTarget());

	transformer.addWorldFieldDeclaration(
		relationName + ': set ' + sourceName + ' set -> set Int set -> set ' + targetName
	);

	transformer.addFact(
		'fact ordering {\n' +
		'        all w: World, x: w.' + sourceName + ' | isSeq[x.(w.' + relationName + ')]\n' +
		'        all w: World, x: w.' + sourceName + ', y: w.' + sourceName + ' | lone x.((w.' + relationName + ').y)\n' +
		'}'
	);
}

function transformGeneralRelation(transformer: Ontouml2Alloy, relation: Relation) {
	let relationName = getNormalizedName(transformer, relation);

	const sourceName = getNormalizedName(transformer, relation.getSource());
	const targetName = getNormalizedName(transformer, relation.getTarget());
	const sourceCardinality = getCardinalityKeyword(relation.getSourceEnd().cardinality);
	const targetCardinality = getCardinalityKeyword(relation.getTargetEnd().cardinality);

	transformer.addWorldFieldDeclaration(
		(relationName + ': set ' + sourceName + ' ' + sourceCardinality + ' -> ' + targetCardinality + ' ' + targetName).replace(/\s{2,}/g, ' ')
	);
}

function transformMediationRelation(transformer: Ontouml2Alloy, relation: Relation) {
	let relationName = getNormalizedName(transformer, relation);

	const sourceName = getNormalizedName(transformer, relation.getSource());

	transformer.addFact(
		'fact acyclic {\n' +
		'        all w: World | acyclic[w.' + relationName + ',w.' + sourceName + ']\n' +
		'}'
	);
	
	transformGeneralRelation(transformer, relation);
}

function transformMaterialRelation(transformer: Ontouml2Alloy, relation: Relation) {
	for (const rel of transformer.model.getAllRelations()) {
		if (rel.hasDerivationStereotype() && rel.getDerivingRelation() === relation
			&& rel.getDerivedClassStereotype() === ClassStereotype.RELATOR) {

			let materialName = getNormalizedName(transformer, relation);
				
			const sourceName = getNormalizedName(transformer, relation.getSource());
			const targetName = getNormalizedName(transformer, relation.getTarget());
			const relatorName = getNormalizedName(transformer, rel.getDerivedClass());

			transformer.addWorldFieldDeclaration(
				materialName + ': set ' + sourceName + ' -> ' + relatorName + ' -> ' + targetName
			);
			return;
		}
	}
	
	if (relation.getSourceEnd().isOrdered || relation.getTargetEnd().isOrdered) {
		transformOrderedRelation(transformer, relation);
	} else {
		transformGeneralRelation(transformer, relation);
	}
}

function transformDerivationRelation(transformer: Ontouml2Alloy, relation: Relation) {
	//TODO: take Comparatives, External Dependence into account

	if (relation.getDerivingRelationStereotype() === RelationStereotype.MATERIAL
		&& relation.getDerivedClassStereotype() === ClassStereotype.RELATOR) {

		const material = relation.getDerivingRelation();
		const relator = relation.getDerivedClass();
		const materialSource = material.getSource();
		const materialTarget = material.getTarget();
		
		let mediation1 = null;
		let mediation2 = null;

		for (const rel of transformer.model.getAllRelations()) {
			if (mediation1 === null
				&& (rel.getSource() === materialSource && rel.getTarget() === relator
				|| rel.getTarget() === materialSource && rel.getSource() === relator)) {
					
					mediation1 = rel;

			} else if (mediation2 === null
				&& (rel.getSource() === materialTarget && rel.getTarget() === relator
				|| rel.getTarget() === materialTarget && rel.getSource() === relator)) {
					
					mediation2 = rel;
			}
		}

		let materialName = getNormalizedName(transformer, material);
		let mediation1Name = getNormalizedName(transformer, mediation1);
		let mediation2Name = getNormalizedName(transformer, mediation2);
	
		const relatorName = getNormalizedName(transformer, relator);
		const materialSourceName = getNormalizedName(transformer, materialSource);
		const materialTargetName = getNormalizedName(transformer, materialTarget);
	
		transformer.addFact(
			'fact derivation {\n' +
			'        all w: World, x: w.' + materialSourceName + ', y: w.' + materialTargetName + ', r: w.' + relatorName + ' | \n' +
			'            x -> r -> y in w.' + materialName + ' iff x in r.(w.' + mediation1Name + ') and y in r.(w.' + mediation2Name + ')\n' +
			'}'
		);
	}
}

function transformPartWholeRelation(transformer: Ontouml2Alloy, relation: Relation) {
	let relationName = getNormalizedName(transformer, relation);

	const wholeName = getNormalizedName(transformer, relation.getSource());
	const partName = getNormalizedName(transformer, relation.getTarget());
	
	const wholeEnd = relation.getSourceEnd();
	let wholeEndName = '';
	if (wholeEnd.getName()) {
		wholeEndName = getNormalizedName(transformer, wholeEnd);
	}	else {
		wholeEndName = getNormalizedName(transformer, relation.getSource());
	}

	const wholeEndAlias = getAlias(wholeEnd, wholeEndName, transformer.aliases);

	if (wholeEnd.isAggregationEnd() && wholeEnd.isComposite()) {
		let otherWholeEnds = []
		for (const prop of transformer.model.getAllProperties()) {
			if (prop.isAggregationEnd() && prop !== wholeEnd) {
				const otherWholeEnd = relation.getSourceEnd();
				let otherWholeEndName = '';
				if (otherWholeEnd.getName()) {
					otherWholeEndName = getNormalizedName(transformer, otherWholeEnd);
				}	else {
					otherWholeEndName = getNormalizedName(transformer, (otherWholeEnd.container as Relation).getSource());
				}

				const otherWholeEndAlias = getAlias(otherWholeEnd, otherWholeEndName, transformer.aliases);
				otherWholeEnds.push(otherWholeEndAlias + '[x,w]');
			}
		}

		otherWholeEnds = [...new Set(otherWholeEnds)];
		if (otherWholeEnds.length) {
			transformer.addFact(
				'fact composition {\n' +
				'        all w: World, x : w.' + partName + ' | lone ' + wholeEndAlias + '[x,w]\n' +
				'        all w: World, x : w.' + partName + ' | some ' + wholeEndAlias + '[x,w] implies no (' + otherWholeEnds.join('+') + ')' +
				'}'
			);
		} else {
			transformer.addFact(
				'fact composition {\n' +
				'        all w: World, x : w.' + partName + ' | lone ' + wholeEndAlias + '[x,w]\n' +
				'}'
			);
		}
	}

	transformer.addFact(
		'fact acyclic {\n' +
		'        all w: World | acyclic[w.' + relationName + ',w.' + wholeName + ']\n' +
		'}'
	);
	
	transformGeneralRelation(transformer, relation);
}

function transformDatatypeRelation(transformer: Ontouml2Alloy, relation: Relation) {
	const sourceName = getNormalizedName(transformer, relation.getSource());
	const targetName = getNormalizedName(transformer, relation.getTarget());
	const sourceDatatype = getCorrespondingDatatype(sourceName, transformer.datatypes);
	
	let relationName = getNormalizedName(transformer, relation);

	sourceDatatype[1].push(relationName + ': '+ targetName);

	const [sourceLowerBound, sourceUpperBound] = getCustomCardinality(relation.getSourceEnd().cardinality);
	const [targetLowerBound, targetUpperBound] = getCustomCardinality(relation.getTargetEnd().cardinality);
	let sourceFact = '';
	let targetFact = '';

	if (targetLowerBound && targetUpperBound) {
		sourceFact =
			'all x: ' + sourceName + ' | #x.' + relationName + '>=' + targetLowerBound + ' and #x.' + relationName + '<=' + targetUpperBound;
	} else if (targetLowerBound) {
		sourceFact =
			'all x: ' + sourceName + ' | #x.' + relationName + '>=' + targetLowerBound;
	} else if (targetUpperBound) {
		sourceFact =
			'all x: ' + sourceName + ' | #x.' + relationName + '<=' + targetUpperBound;
	}

	if (sourceLowerBound && sourceUpperBound) {
		targetFact =
			'all x: ' + targetName + ' | #' + relationName + '.x>=' + sourceLowerBound + ' and #' + relationName + '.x<=' + sourceUpperBound;
	} else if (sourceLowerBound) {
		targetFact =
			'all x: ' + targetName + ' | #' + relationName + '.x>=' + sourceLowerBound;
	} else if (sourceUpperBound) {
		targetFact =
			'all x: ' + targetName + ' | #' + relationName + '.x<=' + sourceUpperBound;
	}

	transformer.addFact(
		'fact datatypesMultiplicity {\n' +
		'        ' + sourceFact + '\n' +
		'        ' + targetFact + '\n' +
		'}'
	);
}

export function transformCharacterizationConstraint(transformer: Ontouml2Alloy) {
	let characterizations = transformer.model.getAllRelationsByStereotype(RelationStereotype.CHARACTERIZATION)
		.map(characterization => {
			return 'w.' + getNormalizedName(transformer, characterization);
		});
	
	if (characterizations.length) {
		let intrinsicMoments = [... new Set([...transformer.model.getClassesRestrictedToIntrinsicMode(), ...transformer.model.getClassesRestrictedToQuality()])]
			.map(moment => 'w.' + getNormalizedName(transformer, moment));
		if (intrinsicMoments.length) {
			transformer.addFact(
				'fact acyclicCharacterizations {\n' +
				'        all w: World | acyclic[(' + characterizations.join('+') + '),(' + intrinsicMoments.join('+') + ')]\n' +
				'}'
			);
		}
	}
}
