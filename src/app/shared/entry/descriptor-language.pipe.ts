import { Pipe, PipeTransform } from '@angular/core';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { Workflow } from '../../shared/openapi';

@Pipe({
  name: 'descriptorLanguage',
  standalone: true,
})
export class DescriptorLanguagePipe implements PipeTransform {
  /**
   * Transforms DescriptorTypeEnum to their friendly names
   * @param descriptorType
   * @returns {string}
   */
  constructor(private descriptorLanguageService: DescriptorLanguageService) {}
  transform(descriptorType: Workflow.DescriptorTypeEnum): string {
    return this.descriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(descriptorType);
  }
}
