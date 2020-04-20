class URIManager {
  uris: { [key: string]: string };

  constructor() {
    this.uris = {};
  }

  generateUniqueURI({ id, name }: { id: string; name: string }): string {
    const names = Object.values(this.uris);

    if (!id && !name) {
      return null;
    }

    if (this.uris[id]) {
      return this.uris[id];
    }

    if (names.includes(name)) {
      this.uris[id] = `${name}_${id}`;
    } else {
      this.uris[id] = name;
    }

    return this.uris[id];
  }
}

export default URIManager;
