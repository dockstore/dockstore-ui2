import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descriptorLanguageVersions',
  standalone: true,
})
export class DescriptorLanguageVersionsPipe implements PipeTransform {
  /**
   * Creates a string containing the descriptor language or engine versions, and the descriptor language if specified by showDescriptorLanguage
   * @param descriptorLanguage
   * @param descriptorLanguageOrEngineVersions
   * @param showDescriptorLanguage whether or not the descriptor language should be included in the resulting string
   * @returns
   */
  transform(descriptorLanguage: string, descriptorLanguageOrEngineVersions: Array<string>, showDescriptorLanguage: boolean = true): string {
    if (descriptorLanguageOrEngineVersions && descriptorLanguageOrEngineVersions.length > 0) {
      const versions = [...descriptorLanguageOrEngineVersions];
      if (showDescriptorLanguage) {
        return descriptorLanguage + ' ' + versions.sort().join(', ');
      } else {
        // Remove the descriptor language from the version if it exists. Ex: 'Nextflow !>=23.04.0' -> '!>=23.04.0'
        return versions
          .map((version) => {
            return version.replace(descriptorLanguage + ' ', '');
          })
          .sort()
          .join(', ');
      }
    }
    return '';
  }
}
