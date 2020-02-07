import { ModelManager } from '@libs/model';

describe('Model deserializing', () => {
  const packages_model = require('@test-models/others/packages.json');

  console.log(packages_model);

  const manager = new ModelManager(packages_model);

  it('Should be fine', () => {
    var bool = true;
    expect(bool).toBeTruthy();
  });
});
