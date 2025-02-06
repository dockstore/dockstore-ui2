import { Pipe, PipeTransform } from '@angular/core';
import { CloudInstance } from '../../shared/openapi';
import PartnerEnum = CloudInstance.PartnerEnum;

@Pipe({
  name: 'platformPartner',
})
export class PlatformPartnerPipe implements PipeTransform {
  /**
   * Transforms PartnerEnum into their display name
   * @param partner
   * @returns {string}
   */
  transform(partner: PartnerEnum): string {
    switch (partner) {
      case PartnerEnum.GALAXY:
        return 'Galaxy';
      case PartnerEnum.TERRA:
        return 'Terra';
      case PartnerEnum.DNASTACK:
        return 'DNAstack';
      case PartnerEnum.DNANEXUS:
        return 'DNAnexus';
      case PartnerEnum.NHLBIBIODATACATALYST:
        return 'NHLBI BioData Catalyst';
      case PartnerEnum.ANVIL:
        return 'AnVIL';
      case PartnerEnum.CAVATICA:
        return 'Cavatica';
      case PartnerEnum.NEXTFLOWTOWER:
        return 'Nextflow Tower';
      case PartnerEnum.ELWAZI:
        return 'eLwazi';
      case PartnerEnum.TOIL:
        return 'Toil';
      case PartnerEnum.OTHER:
        return 'Other';
      case PartnerEnum.ALL:
        return 'All Platforms';
      default:
        //includes CGC, AGC
        return partner;
    }
  }
}
