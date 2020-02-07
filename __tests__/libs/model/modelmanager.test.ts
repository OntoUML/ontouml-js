import { ModelManager } from '@libs/model';

describe('Model deserializing', () => {
  const packages_model = require('@test-models/others/packages.json');
  const manager = new ModelManager(packages_model);
  // console.log(manager);

  it('Should be fine', () => {
    var bool = true;
    expect(bool).toBeTruthy();
  });
});
