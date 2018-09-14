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

import { Sponsor } from './sponsor.model';

export class SponsorsService {
  // TODO: UCSC logo is technically different than the one linked to
  private sponsors: Sponsor[] = [
    new Sponsor('collaboratory.png', new URL('https://www.cancercollaboratory.org/')),
    new Sponsor('oicr.png', new URL('https://oicr.on.ca/')),
    new Sponsor('ga4gh.png', new URL('https://genomicsandhealth.org/')),
    new Sponsor('ucsc.png', new URL('https://ucscgenomics.soe.ucsc.edu/'))
    // new Sponsor('broad.png', new URL('https://www.broadinstitute.org/'))
  ];

  private partners: Sponsor[] = [
    new Sponsor('cwl.png', new URL('https://www.commonwl.org')),
    new Sponsor('wdl.png', new URL('http://openwdl.org')),
    new Sponsor('nfl.png', new URL('https://www.nextflow.io')),
    new Sponsor('dnastack.png', new URL('https://dnastack.com'))
  ];

  getSponsors(): Sponsor[] {
    return this.sponsors;
  }

  getPartners(): Sponsor[] {
    return this.partners;
  }
}
