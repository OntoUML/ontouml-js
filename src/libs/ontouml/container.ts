export interface Container<ContentType, DeepContentType> {
  getContents(contentsFilter?: (content: ContentType) => boolean): ContentType[];
  getAllContents(contentsFilter?: (content: DeepContentType) => boolean): DeepContentType[];
}
