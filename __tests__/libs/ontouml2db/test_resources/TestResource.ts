import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';

it('should ignore', () => {
  expect(true).toBe(true);
});

export interface TestResource {
  title: string;
  model: object;
  checker: GraphChecker;
}
