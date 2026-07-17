import { MultilingualText, Resource } from '../src';

describe('Resource tests', () => {
  it('should hold a URI and a multilingual name', () => {
    const resource = new Resource('https://example.org/thing', 'Thing', 'en');

    expect(resource.uri).toEqual('https://example.org/thing');
    expect(resource.name).toBeInstanceOf(MultilingualText);
    expect(resource.name.get('en')).toEqual('Thing');
  });

  it('should support empty resources', () => {
    const resource = new Resource();

    expect(resource.uri).toBeUndefined();
    expect(resource.name.get()).toBeNull();
  });

  it('should serialize into the schema resource shape', () => {
    const resource = new Resource('https://example.org/thing', 'Thing');
    expect(resource.toJSON()).toEqual({
      URI: 'https://example.org/thing',
      name: { en: 'Thing' }
    });
  });

  it('should serialize missing fields as null', () => {
    expect(new Resource().toJSON()).toEqual({ URI: null, name: null });
  });
});
