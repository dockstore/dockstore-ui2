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

export class Sponsor {
  private static colouredPath = '../assets/images/sponsors/coloured/';
  private static nonColouredPath = '../assets/images/sponsors/non-coloured/';

  public current: string;
  public nonColouredCurrent: string;
  public coloured: string;
  public url: URL;
  public name: string;

  constructor(image: string, url: URL) {
    this.current = Sponsor.colouredPath + image;
    // used for "in affiliation with" logos in the footer
    this.nonColouredCurrent = Sponsor.nonColouredPath + image;
    this.url = url;
    this.name = image;
  }
}
