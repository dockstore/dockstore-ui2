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

import { Injectable } from '@angular/core';
import { Sponsor } from './sponsor.model';

@Injectable()
export class SponsorsService {
  private languages: Sponsor[] = [
    new Sponsor('cwl.png', new URL('https://www.commonwl.org')),
    new Sponsor('wdl.png', new URL('http://openwdl.org')),
    new Sponsor('nfl.png', new URL('https://www.nextflow.io')),
  ];

  private partners: Sponsor[] = [
    new Sponsor('dnastack.png', new URL('https://dnastack.com')),
    new Sponsor('sevenbridges.png', new URL('https://www.sevenbridges.com')),
    new Sponsor('terra.png', new URL('https://terra.bio')),
  ];

  getPartners(): Sponsor[] {
    return this.partners;
  }

  getLanguages(): Sponsor[] {
    return this.languages;
  }
}
