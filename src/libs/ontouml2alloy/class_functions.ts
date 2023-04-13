import { Class, ClassStereotype, Relation } from '@libs/ontouml';
import { RelationStereotype } from '@libs/ontouml/model/stereotypes';
import { Ontouml2Alloy } from '.';
import { normalizeName, isTopLevel, getValidAlias } from './util';

export function transformClass(transformer: Ontouml2Alloy, _class: Class) { //This line defines a function named transformClass that takes two parameters: transformer (of type Ontouml2Alloy) and _class (of type Class).
  if (_class.hasAnyStereotype([ClassStereotype.EVENT, ClassStereotype.SITUATION])) { //This line checks if the given class _class has any of the stereotypes EVENT or SITUATION. If it does, the function immediately returns without doing anything.
    return;
  }

  if (_class.hasDatatypeStereotype()) {
    transformDatatypeClass(transformer, _class);
    return;
  }

  if (_class.hasEnumerationStereotype()) {
    transformEnumerationClass(transformer, _class);
    return;
  }
  
  if (_class.isRestrictedToEndurant()) {
    transformEndurantClass(transformer, _class);
  }
  /*
    This line checks if the given class _class is a restricted endurant. If it is, the transformEndurantClass function is called with the transformer and _class parameters.
  */

  if (_class.hasRelatorStereotype()) {
    transformRelatorConstraint(transformer, _class);
  }

  if (_class.isAbstract) {
    transformAbstractClass(transformer, _class);
  }

  transformWeakSupplementationConstraint(transformer, _class);
  transformDisjointNaturesConstraint(transformer, _class);
}

function transformAbstractClass(transformer: Ontouml2Alloy, _class: Class) {
  const className = normalizeName(_class);
  const subtypes = _class.getChildren().map(subtype => 'w.' + normalizeName(subtype));

  if (subtypes.length) {
    transformer.addFact(
      'fact abstractClass {\n' +
      '        all w: World | w.' + className + ' = ' + subtypes.join('+') + '\n' +
      '}'
    );
  }
}

function transformEndurantClass(transformer: Ontouml2Alloy, _class: Class) {
  const className = normalizeName(_class);
  let nature = '';

  if (_class.isRestrictedToSubstantial()) {
    nature = 'Object';
  } else if (_class.isRestrictedToMoment()) {
    nature = 'Aspect';
  } else {
    nature = 'Endurant';
  }

  transformer.addWorldFieldDeclaration(
    className + ': set exists:>' + nature
  );

  if (isTopLevel(_class, transformer.model.getAllGeneralizations())) {
    if (_class.hasRigidStereotype()) {
      transformer.addFact(
        'fact rigid {\n' +
        '        rigidity[' + className + ',' + nature + ',exists]\n' +
        '}'
      );
    } else if (_class.hasAntiRigidStereotype()) {
      transformer.addFact(
        'fact antirigid {\n' +
        '        antirigidity[' + className + ',' + nature + ',exists]\n' +
        '}'
      );
    }
  }
}

function transformDatatypeClass(transformer: Ontouml2Alloy, _class: Class) {
  const datatypeName = normalizeName(_class);
  transformer.addDatatype([datatypeName, []]);
}

function transformEnumerationClass(transformer: Ontouml2Alloy, _class: Class) {
  const enumName = normalizeName(_class);
  const literals = _class.literals.map(literal => normalizeName(literal));

  if (literals.length) {
    transformer.addEnum(
      'enum ' + enumName + ' {\n' +
        '        ' + literals.join(', ') +
      '}'
    );
  }
}

function transformRelatorConstraint(transformer: Ontouml2Alloy, _class: Class) {
  const mediations = []
  for (const mediation of transformer.model.getAllRelationsByStereotype(RelationStereotype.MEDIATION)) {
    if (mediation.getSource() == _class) {
      const mediated = mediation.getTargetEnd();
      let mediatedName = '';
	
      if (mediated.getName()) {
        mediatedName = normalizeName(mediated);
      }	else {
        mediatedName = normalizeName(mediation.getTarget());
      }

      const mediatedAlias = getValidAlias(mediated, mediatedName, transformer.aliases);
      mediations.push(mediatedAlias + '[x,w]');
    }
  }

  if (mediations.length) {
    const relatorName = normalizeName(_class);
    transformer.addFact(
      'fact relatorConstraint {\n' +
      '        all w: World, x: w.' + relatorName + ' | #(' + mediations.join('+') + ')>=2\n' +
      '}'
    );
  }
}

function transformWeakSupplementationConstraint(transformer: Ontouml2Alloy, _class: Class) {
  let parts = [];

	for (const rel of transformer.model.getAllRelations()) {
		if (rel.isPartWholeRelation() || rel.hasComponentOfStereotype() || rel.hasMemberOfStereotype()
		|| rel.hasSubCollectionOfStereotype() || rel.hasSubQuantityOfStereotype()) {
			if (rel.getSource() === _class) {
        const part = rel.getTargetEnd();
        let partName = '';
	
        if (part.getName()) {
          partName = normalizeName(part);
        }	else {
          partName = normalizeName((part.container as Relation).getTarget());
        }

        const partAlias = getValidAlias(part, partName, transformer.aliases);
				parts.push(partAlias + '[x,w]');
			}
		}
	}

  if (parts.length) {
    const wholeName = normalizeName(_class);

    transformer.addFact(
      'fact weakSupplementationConstraint {\n' +
      '        all w: World, x: w.' + wholeName + ' | #(' + parts.join('+') + ')>=2\n' +
      '}'
    );
  }
}

function transformDisjointNaturesConstraint(transformer: Ontouml2Alloy, _class: Class) {
  if (!isTopLevel(_class, transformer.model.getAllGeneralizations())) {
    return;
  }

  let differentNaturedClasses = [];
  for (const otherClass of transformer.model.getAllClasses()) {
    if (isTopLevel(otherClass, transformer.model.getAllGeneralizations())
      && !otherClass.restrictedToContainedIn(_class.restrictedTo)) {

      differentNaturedClasses.push(normalizeName(otherClass));
    }
  }

  if (differentNaturedClasses.length) {
    const className = normalizeName(_class);
    if (differentNaturedClasses.length == 1) {
      transformer.addWorldFieldFact(
        'disjoint[' + className + ',' + differentNaturedClasses[0] + ']'
      );
    } else {
      transformer.addWorldFieldFact(
        'disjoint[' + className + ',(' + differentNaturedClasses.join('+') + ')]'
      );
    }
  }
}

export function transformAdditionalClassConstraints(transformer: Ontouml2Alloy) {
  let objectClasses = [];
  let aspectClasses = [];

  for (const _class of transformer.model.getAllClasses()) {
    if (_class.isRestrictedToEndurant() && isTopLevel(_class, transformer.model.getAllGeneralizations())) {
      const className = normalizeName(_class);

      if (_class.isRestrictedToSubstantial()) {
        objectClasses.push(className);
      } else if (_class.isRestrictedToMoment()) {
        aspectClasses.push(className);
      } else {
        objectClasses.push(className);
        aspectClasses.push(className);
      }
    }
  }

  if (objectClasses.length) {
    transformer.addWorldFieldFact(
      'exists:>Object in ' + objectClasses.join('+')
    );
  }

  if (aspectClasses.length) {
    transformer.addWorldFieldFact(
      'exists:>Aspect in ' + aspectClasses.join('+')
    );
  }  
}

export function transformAdditionalDatatypeConstraints(transformer: Ontouml2Alloy) {
  const datatypes = transformer.model.getClassesWithDatatypeStereotype();

  if (datatypes.length) {
    const topLevelDatatypes = []
    for (const datatype of datatypes) {
      if (isTopLevel(datatype, transformer.model.getAllGeneralizations())) {
        topLevelDatatypes.push(datatype);
      }
    }

    const datatypesNames = datatypes.map(datatype => normalizeName(datatype));

    if (topLevelDatatypes.length >= 2) {
      const topLevelDatatypesNames = topLevelDatatypes.map(datatype => normalizeName(datatype));

      transformer.addFact(
        'fact additionalDatatypeFacts {\n' +
        '        Datatype = ' + datatypesNames.join('+') + '\n' +
        '        disjoint[' + topLevelDatatypesNames.join(',') + ']\n' +
        '}'
      );
    } else {
      transformer.addFact(
        'fact additionalDatatypeFacts {\n' +
        '        Datatype = ' + datatypesNames.join('+') + '\n' +
        '}'
      );
    }
  }
}
