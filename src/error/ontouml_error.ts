import uniqid from 'uniqid';

class OntoUMLError {
  id: IOntoUMLError['id'];
  code: IOntoUMLError['code'];
  title: IOntoUMLError['title'];
  detail: IOntoUMLError['detail'];
  links: IOntoUMLError['links'];
  meta?: IOntoUMLError['meta'];

  constructor(raw: IOntoUMLError) {
    const { id, code, title, detail, links, meta } = raw;

    this.id = id || uniqid();
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.links = links;
    this.meta = meta;
  }

  print() {
    const { id, code, title, detail, links, meta } = this;

    console.log({
      id,
      code,
      title,
      detail,
      links,
      meta,
    });
  }
}

export default OntoUMLError;
