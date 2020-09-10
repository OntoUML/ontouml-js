/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { StrategyType } from '@libs/ontouml2db/strategies/StrategyType';
import { DBMSType } from '@libs/ontouml2db/file_generation/DMBSType';
import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
import { IOntoUML2DBOptions } from '@libs/ontouml2db/IOntoUML2DBOptions';
import { RunExample } from './test_models/index'
import { test_001_simple_flattening,
  test_002_flatting_with_duplicate_attribures,
  test_003_flatting_gs,
  test_004_flatting_multiples_generalizations,
  test_005_flatting_orthogonal_gs,
  test_006_flatting_cascading_gs,
  test_007_flatting_category_without_specialization,
  test_008_flatting_root_association,
  test_009_flatting_with_association,
  test_010_flatting_with_association_multiples_generalizations,
  test_011_flatting_cascading_association_multiples_gs,
  test_012_simple_lifting,
  test_013_lifting_cascade_generalization,
  test_014_lifting_multiple_generalizations,
  test_015_lifting_multiple_generalizations_duplicate_attributes,
  test_016_lifting_cascade_generalization_association,
  test_017_lifting_gs_association,
  test_018_lifting_orthogonal_gs,
  test_019_lifting_generalization_and_gs,
  test_020_lifting_hierarchy_gs,
  test_021_lifting_Generalization_and_gs_association,
  test_022_lifting_gs_disjoint,
  test_023_lifting_gs_disjoint_incomplete,
  test_024_lifting_gs_overlapping_complete,
  test_025_lifting_gs_overlapping_incomplete,
  test_026_flatting_to_class_association,
  test_027_lifting_multiple_relations_to_remake,
  test_028_multivalued_property } from './test_models/index';

import { gChecker_run_example, 
  gChecker_001_simple_flattening,
  gChecker_002_flatting_with_duplicate_attribures,
  gChecker_003_flatting_gs, 
  gChecker_004_flatting_multiples_generalizations, 
  gChecker_005_flatting_orthogonal_gs, 
  gChecker_006_flatting_cascading_gs, 
  gChecker_007_flatting_category_without_specialization, 
  gChecker_008_flatting_root_association, 
  gChecker_009_flatting_with_association, 
  gChecker_010_flatting_with_association_multiples_generalizations, 
  gChecker_011_flatting_cascading_association_multiples_gs, 
  gChecker_012_simple_lifting, 
  gChecker_013_lifting_cascade_generalization, 
  gChecker_014_lifting_multiple_generalizations, 
  gChecker_015_lifting_multiple_generalizations_duplicate_attributes, 
  gChecker_016_lifting_cascade_generalization_association, 
  gChecker_017_lifting_gs_association, 
  gChecker_018_lifting_orthogonal_gs, 
  gChecker_019_lifting_generalization_and_gs, 
  gChecker_020_lifting_hierarchy_gs, 
  gChecker_021_lifting_generalization_and_gs_association, 
  gChecker_022_lifting_gs_disjoint_complete, 
  gChecker_023_lifting_gs_disjoint_incomplete, 
  gChecker_024_lifting_gs_overlapping_complete, 
  gChecker_025_lifting_gs_overlapping_incomplete, 
  gChecker_026_flatting_to_class_association, 
  gChecker_027_lifting_multiple_relations_to_remake, 
  gChecker_028_multivalued_property } from './target_graphcs/index';


let options: IOntoUML2DBOptions = {  
  strategyType: StrategyType.ONE_TABLE_PER_KIND, 
  dbms: DBMSType.GENERIC_SCHEMA,
  standardizeNames: true};

describe('Database transformation test', () => {
  test('Run Example', () => {
    //Tests the transformation applied to a comprehensive example. All other tests evaluate the 
    //relationships between classes in isolation.
    let mapper = new OntoUML2DB(RunExample);
    mapper.getSchema( options );

    gChecker_run_example.setTransformation(mapper);

    let result = gChecker_run_example.check();

    if (result != '') {
      console.log(mapper.getSourceGraph().toString());
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('001 Evaluates flattening involving only one generalization', () => {
    let mapper = new OntoUML2DB(test_001_simple_flattening);
    mapper.getSchema( options );

    gChecker_001_simple_flattening.setTransformation(mapper);

    let result = gChecker_001_simple_flattening.check();

    if (result != '') {
      console.log( mapper.getTargetGraph().toString() );
      expect(result).toBe('');
    }
  });

  test('002 Evaluates flattening involving only one generalization where there are attributes with the same name in the superclass and subclass', () => {
    let mapper = new OntoUML2DB(test_002_flatting_with_duplicate_attribures);
    mapper.getSchema( options );

    gChecker_002_flatting_with_duplicate_attribures.setTransformation(mapper);

    let result = gChecker_002_flatting_with_duplicate_attribures.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('003 Evaluates flattening involving only one generalizations set', () => {
    let mapper = new OntoUML2DB(test_003_flatting_gs);
    mapper.getSchema( options );

    gChecker_003_flatting_gs.setTransformation(mapper);

    let result = gChecker_003_flatting_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('004 Evaluates flattening involving one generalizations set and one simple generalization', () => {
    let mapper = new OntoUML2DB(test_004_flatting_multiples_generalizations);
    mapper.getSchema( options );

    gChecker_004_flatting_multiples_generalizations.setTransformation(mapper);

    let result = gChecker_004_flatting_multiples_generalizations.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('005 Evaluates flattening involving two orthogonal generalizations sets to each other', () => {
    let mapper = new OntoUML2DB(test_005_flatting_orthogonal_gs);
    mapper.getSchema( options );

    gChecker_005_flatting_orthogonal_gs.setTransformation(mapper);

    let result = gChecker_005_flatting_orthogonal_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('006 Evaluates the flattening involving a generalization set, where the subclasses are superclasses of other classes', () => {
    let mapper = new OntoUML2DB(test_006_flatting_cascading_gs);
    mapper.getSchema( options );

    gChecker_006_flatting_cascading_gs.setTransformation(mapper);

    let result = gChecker_006_flatting_cascading_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('007 Evaluates the flattening involving one generalization set, where the superclass has one generalization relationship with another nonsortal class', () => {

    let mapper = new OntoUML2DB(test_007_flatting_category_without_specialization);
    mapper.getSchema( options );

    gChecker_007_flatting_category_without_specialization.setTransformation(mapper);

    let result = gChecker_007_flatting_category_without_specialization.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('008 Evaluates the flattening involving a generalization set, where the superclass has an association with a sortal', () => {
    let mapper = new OntoUML2DB(test_008_flatting_root_association);
    mapper.getSchema( options );

    gChecker_008_flatting_root_association.setTransformation(mapper);

    let result = gChecker_008_flatting_root_association.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('009 Evaluates the flattening involving a generalization set and a hierarchy of nonSortals', () => {
    let mapper = new OntoUML2DB(test_009_flatting_with_association);
    mapper.getSchema( options );

    gChecker_009_flatting_with_association.setTransformation(mapper);

    let result = gChecker_009_flatting_with_association.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('010 Evaluates the flatting with one association and multiples generalizations', () => {
    let mapper = new OntoUML2DB(test_010_flatting_with_association_multiples_generalizations);
    mapper.getSchema( options );

    gChecker_010_flatting_with_association_multiples_generalizations.setTransformation(mapper);

    let result = gChecker_010_flatting_with_association_multiples_generalizations.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('011 Evaluates the flatting with one association and multiples generalization sets', () => {
    let mapper = new OntoUML2DB(test_011_flatting_cascading_association_multiples_gs);
    mapper.getSchema( options );

    gChecker_011_flatting_cascading_association_multiples_gs.setTransformation(mapper);

    let result = gChecker_011_flatting_cascading_association_multiples_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('012 Evaluates the lifting with a simple generalization', () => {
    let mapper = new OntoUML2DB(test_012_simple_lifting);
    mapper.getSchema( options );

    gChecker_012_simple_lifting.setTransformation(mapper);

    let result = gChecker_012_simple_lifting.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('013 Evaluate the lifting with cascading generalizations', () => {
    let mapper = new OntoUML2DB(test_013_lifting_cascade_generalization);
    mapper.getSchema( options );

    gChecker_013_lifting_cascade_generalization.setTransformation(mapper);

    let result = gChecker_013_lifting_cascade_generalization.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('014 Evaluate the lifting with multiple generalizations, without forming a generalization set ', () => {
    let mapper = new OntoUML2DB(test_014_lifting_multiple_generalizations);
    mapper.getSchema( options );

    gChecker_014_lifting_multiple_generalizations.setTransformation(mapper);

    let result = gChecker_014_lifting_multiple_generalizations.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('015 Evaluate the survey with a generalization set with the attribute name repeated in both subclasses ', () => {
    let mapper = new OntoUML2DB(test_015_lifting_multiple_generalizations_duplicate_attributes);
    mapper.getSchema( options );

    gChecker_015_lifting_multiple_generalizations_duplicate_attributes.setTransformation(mapper);

    let result = gChecker_015_lifting_multiple_generalizations_duplicate_attributes.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('016 Evaluate the lifting with cascading generalizations and one association with the subclass', () => {
    let mapper = new OntoUML2DB(test_016_lifting_cascade_generalization_association);
    mapper.getSchema( options );

    gChecker_016_lifting_cascade_generalization_association.setTransformation(mapper);

    let result = gChecker_016_lifting_cascade_generalization_association.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('017 Evaluate the lifting with one generalization set, where one subclass has one specializatoin and one association', () => {
    let mapper = new OntoUML2DB(test_017_lifting_gs_association);
    mapper.getSchema( options );

    gChecker_017_lifting_gs_association.setTransformation(mapper);

    let result = gChecker_017_lifting_gs_association.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('018 Evaluate the lifting with orthogonal generalization sets', () => {
    let mapper = new OntoUML2DB(test_018_lifting_orthogonal_gs);
    mapper.getSchema( options );

    gChecker_018_lifting_orthogonal_gs.setTransformation(mapper);

    let result = gChecker_018_lifting_orthogonal_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('019 Evaluate the lifting with one generalization set and two simple generalizations', () => {
    let mapper = new OntoUML2DB(test_019_lifting_generalization_and_gs);
    mapper.getSchema( options );

    gChecker_019_lifting_generalization_and_gs.setTransformation(mapper);

    let result = gChecker_019_lifting_generalization_and_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('020 Evaluate the lifting with hierarchy of generalization sets', () => {
    let mapper = new OntoUML2DB(test_020_lifting_hierarchy_gs);
    mapper.getSchema( options );

    gChecker_020_lifting_hierarchy_gs.setTransformation(mapper);

    let result = gChecker_020_lifting_hierarchy_gs.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('021 Evaluate the lifting with generalizations, one generalization set and association in the subclasses', () => {
    let mapper = new OntoUML2DB(test_021_lifting_Generalization_and_gs_association);
    mapper.getSchema( options );

    gChecker_021_lifting_generalization_and_gs_association.setTransformation(mapper);

    let result = gChecker_021_lifting_generalization_and_gs_association.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('022 Evaluate the lifting with a disjoint and complete generalization set', () => {
    let mapper = new OntoUML2DB(test_022_lifting_gs_disjoint);
    mapper.getSchema( options );

    gChecker_022_lifting_gs_disjoint_complete.setTransformation(mapper);

    let result = gChecker_022_lifting_gs_disjoint_complete.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('023 Evaluate the lifting with a disjoint and incomplete generalization set', () => {
    let mapper = new OntoUML2DB(test_023_lifting_gs_disjoint_incomplete);
    mapper.getSchema( options );

    gChecker_023_lifting_gs_disjoint_incomplete.setTransformation(mapper);

    let result = gChecker_023_lifting_gs_disjoint_incomplete.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('024 Evaluate the lifting with a overlapping and complete generalization set', () => {
    let mapper = new OntoUML2DB(test_024_lifting_gs_overlapping_complete);
    mapper.getSchema( options );

    gChecker_024_lifting_gs_overlapping_complete.setTransformation(mapper);

    let result = gChecker_024_lifting_gs_overlapping_complete.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('025 Evaluate the lifting with a overlapping and incomplete generalization set', () => {
    let mapper = new OntoUML2DB(test_025_lifting_gs_overlapping_incomplete);
    mapper.getSchema( options );

    gChecker_025_lifting_gs_overlapping_incomplete.setTransformation(mapper);

    let result = gChecker_025_lifting_gs_overlapping_incomplete.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('026 Evaluate the cardinality of the association with the superclass in the event of a flattening', () => {
    let mapper = new OntoUML2DB(test_026_flatting_to_class_association);
    mapper.getSchema( options );

    gChecker_026_flatting_to_class_association.setTransformation(mapper);

    let result = gChecker_026_flatting_to_class_association.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('027 Evaluate the lifting when one subclass has two indirect associations', () => {
    let mapper = new OntoUML2DB(test_027_lifting_multiple_relations_to_remake);
    mapper.getSchema( options );

    gChecker_027_lifting_multiple_relations_to_remake.setTransformation(mapper);

    let result = gChecker_027_lifting_multiple_relations_to_remake.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('028 Evaluates the multivalued property', () => {
    let mapper = new OntoUML2DB(test_028_multivalued_property);
    mapper.getSchema( options );

    gChecker_028_multivalued_property.setTransformation(mapper);

    let result = gChecker_028_multivalued_property.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });
});
