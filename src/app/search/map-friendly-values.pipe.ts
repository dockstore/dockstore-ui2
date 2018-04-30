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
    ['tags.verified', new Map([
      ['1', 'verified'], ['0', 'non-verified']
    ])],
    ['private_access', new Map([
      ['1', 'private'], ['0', 'public']
    ])],
    ['registry', new Map([
      ['QUAY_IO', 'Quay.io'], ['DOCKER_HUB', 'Docker Hub'], ['GITLAB', 'GitLab'], ['AMAZON_ECR', 'Amazon ECR']
    ])],
    ['source_control_provider.keyword', new Map([
      ['GITHUB', 'github.com'], ['BITBUCKET', 'bitbucket.org'], ['GITLAB', 'gitlab.com']
    ])]
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
    if (this.friendlyValueNames.has(key)) {
      return this.friendlyValueNames.get(key).get(subBucket.toString());
    } else {
      return subBucket;
    }
  }
}
