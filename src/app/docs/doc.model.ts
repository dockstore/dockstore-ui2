export class Doc {

  private static basePath = '../assets/docs/';

  private slug: string;
  private description: string;
  private title: string;
  private path: string;

  constructor(slug: string,
              description: string,
              title: string) {
    this.slug = slug;
    this.description = description;
    this.title = title;
    this.path = Doc.basePath + slug + '.md';
  }

  getSlug() {
    return this.slug;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getPath() {
    return this.path;
  }
}
