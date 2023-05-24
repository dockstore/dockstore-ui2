import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descriptorLanguageVersions',
})
export class DescriptorLanguageVersionsPipe implements PipeTransform {
  /**
   * Creates a string containing the descriptor language and descriptor language versions
   * @param descriptorLanguage
   * @param descriptorLanguageVersions
   * @returns
   */
  transform(descriptorLanguage: string, descriptorLanguageVersions: Array<string>): string {
    if (descriptorLanguageVersions && descriptorLanguageVersions.length > 0) {
      const languageVersions = [...descriptorLanguageVersions];
      return descriptorLanguage + ' ' + languageVersions.sort().join(', ');
    }
    return '';
  }
}
