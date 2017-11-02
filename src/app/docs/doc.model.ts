/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
