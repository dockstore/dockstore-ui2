import { Pipe, PipeTransform } from '@angular/core';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { Workflow } from '../../shared/swagger';

@Pipe({
  name: 'descriptorLanguage',
})
export class DescriptorLanguagePipe implements PipeTransform {
  /**
   * When displaying the descriptor type typically the workflow descriptor type string is used
   * However for Galaxy this is 'gxformat2', so change it to be Galaxy.
   * The shortFriendlyName is 'Galaxy' so use that.
   * @param descriptorType
   * @returns {string}
   */
  constructor(private descriptorLanguageService: DescriptorLanguageService) {}
  transform(descriptorType: string): string {
    if (descriptorType === 'gxformat2') {
      return this.descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.Gxformat2);
    } else {
      return descriptorType.toUpperCase();
    }
  }
}
