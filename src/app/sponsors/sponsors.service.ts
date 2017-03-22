import { Sponsor } from './sponsor.model';

export class SponsorsService {
  private sponsors: Sponsor[] = [
    new Sponsor('collaboratory.png', new URL('https://www.cancercollaboratory.org/')),
    new Sponsor('oicr.png', new URL('https://oicr.on.ca/')),
    new Sponsor('ga4gh.png', new URL('https://genomicsandhealth.org/')),
    new Sponsor('cwl.png', new URL('http://www.commonwl.org/'))
  ];

  getSponsors(): Sponsor[] {
    return this.sponsors;
  }
}
