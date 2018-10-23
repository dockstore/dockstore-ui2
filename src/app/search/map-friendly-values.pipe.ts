import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapFriendlyValue'
})
export class MapFriendlyValuesPipe implements PipeTransform {
  /**
   * Map containing what the friendly names should be mapped to
   *
   * @memberof MapFriendlyValuesPipe
   */
  readonly friendlyValueNames = new Map([
    ['workflowVersions.verified', new Map([
      ['1', 'verified'], ['0', 'non-verified']
    ])],
    ['is_checker', new Map([
      ['1', 'checker workflows'], ['0', 'non-checker workflows']
    ])],
    ['has_checker', new Map([
      ['1', 'has a checker workflow'], ['0', 'unchecked workflow']
    ])],
    ['tags.verified', new Map([
      ['1', 'verified'], ['0', 'non-verified']
    ])],
    ['private_access', new Map([
      ['1', 'private'], ['0', 'public']
    ])],
    ['descriptorType', new Map([
      ['cwl', 'CWL'], ['wdl', 'WDL'], ['nfl', 'Nextflow'], ['NFL', 'Nextflow']
    ])],
    ['descriptor_type', new Map([
      ['CWL', 'CWL'], ['WDL', 'WDL'],
      ['cwl', 'CWL'], ['wdl', 'WDL'], ['nfl', 'Nextflow'], ['NFL', 'Nextflow']
    ])],
    ['registry', new Map([
      ['QUAY_IO', 'Quay.io'], ['DOCKER_HUB', 'Docker Hub'], ['GITLAB', 'GitLab'], ['AMAZON_ECR', 'Amazon ECR'],
      ['SEVEN_BRIDGES', 'Seven Bridges']
    ])],
    ['source_control_provider.keyword', new Map([
      ['GITHUB', 'github.com'], ['BITBUCKET', 'bitbucket.org'], ['GITLAB', 'gitlab.com'], ['DOCKSTORE', 'dockstore.org']
    ])],
    ['descriptor_tooltip', new Map([
      ['CWL', 'Common Workflow Language'], ['WDL', 'Workflow Description Language'],
      ['NFL', 'Nextflow coming soon!']
    ])],
    ['author', new Map([
      ['', 'n/a']
    ])],
  ]);

  /**
   * This pipe searches the friendly value names map for the key whose value is 'subBucket'
   *
   * @param {string} key The key (e.g. file_formats.keyword)
   * @param {string} subBucket The sub-bucket value (e.g. http://edamontology.org/data_9090)
   * @returns {string} The friendly name if found, otherwise the same name
   * @memberof MapFriendlyValuesPipe
   */
  transform(key: string, subBucket: string): string {
    if (!subBucket) {
      return subBucket;
    }
    if (this.friendlyValueNames.has(key) && this.friendlyValueNames.get(key).get(subBucket.toString())) {
      return this.friendlyValueNames.get(key).get(subBucket.toString());
    } else {
      return subBucket;
    }
  }
}
