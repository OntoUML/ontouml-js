import { gChecker_run_example } from "./run_example";
import { gChecker_001_simple_flattening } from "./001_simple_flattening";
import { gChecker_002_flatting_with_duplicate_attribures } from "./002_flatting_with_duplicate_attribures"
import { gChecker_003_flatting_gs } from './003_flatting_gs';
import { gChecker_004_flatting_multiples_generalizations } from './004_flatting_multiples_generalizations';
import { gChecker_005_flatting_orthogonal_gs } from './005_flatting_orthogonal_gs';
import { gChecker_006_flatting_cascading_gs } from './006_flatting_cascading_gs';
import { gChecker_007_flatting_category_without_specialization } from './007_flatting_category_without_specialization';
import { gChecker_008_flatting_root_association } from './008_flatting_root_association';
import { gChecker_009_flatting_with_association } from './009_flatting_with_association';
import { gChecker_010_flatting_with_association_multiples_generalizations } from './010_flatting_with_association_multiples_generalizations';
import { gChecker_011_flatting_cascading_association_multiples_gs } from './011_flatting_cascading_association_multiples_gs';
import { gChecker_012_simple_lifting } from './012_simple_lifting';
import { gChecker_013_lifting_cascade_generalization } from './013_lifting_cascade_generalization';
import { gChecker_014_lifting_multiple_generalizations } from './014_lifting_multiple_generalizations';
import { gChecker_015_lifting_multiple_generalizations_duplicate_attributes } from './015_lifting_multiple_generalizations_duplicate_attributes';
import { gChecker_016_lifting_cascade_generalization_association } from './016_lifting_cascade_generalization_association';
import { gChecker_017_lifting_gs_association } from './017_lifting_gs_association';
import { gChecker_018_lifting_orthogonal_gs } from './018_lifting_orthogonal_gs';
import { gChecker_019_lifting_generalization_and_gs } from './019_lifting_generalization_and_gs';
import { gChecker_020_lifting_hierarchy_gs } from './020_lifting_hierarchy_gs';
import { gChecker_021_lifting_generalization_and_gs_association } from './021_lifting_generalization_and_gs_association';
import { gChecker_022_lifting_gs_disjoint_complete } from './022_lifting_gs_disjoint_complete';
import { gChecker_023_lifting_gs_disjoint_incomplete } from './023_lifting_gs_disjoint_incomplete';
import { gChecker_024_lifting_gs_overlapping_complete } from './024_lifting_gs_overlapping_complete';
import { gChecker_025_lifting_gs_overlapping_incomplete } from './025_lifting_gs_overlapping_incomplete';
import { gChecker_026_flatting_to_class_association } from './026_flatting_to_class_association';
import { gChecker_027_lifting_multiple_relations_to_remake } from './027_lifting_multiple_relations_to_remake';
import { gChecker_028_multivalued_property } from './028_multivalued_property';
        
export{
    gChecker_run_example,
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
    gChecker_028_multivalued_property,
}

it('should ignore', () => {
    expect(true).toBe(true);
  });