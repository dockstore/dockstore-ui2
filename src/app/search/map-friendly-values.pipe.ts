/*
 *    Copyright 2019 OICR
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
import { Pipe, PipeTransform } from '@angular/core';
import { ToolFile } from 'app/shared/swagger';

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
      ['NFL', 'Nextflow']
    ])],
    ['author', new Map([
      ['', 'n/a']
    ])],
    ['ToolFile.FileTypeEnum', new Map([
      [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR, 'Primary Descriptor'],
      [ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR, 'Secondary Descriptors'],
      [ToolFile.FileTypeEnum.TESTFILE, 'Test Parameter Files'],
      [ToolFile.FileTypeEnum.CONTAINERFILE, 'Dockerfile'],
      [ToolFile.FileTypeEnum.OTHER, 'Service Files']
    ])]
  ]);

  /**
   * This pipe searches the friendly value names map for the key whose value is 'subBucket'
   *
   * @param {string} key The key (e.g. file_formats.keyword)
   * @param {(string | number)} subBucket The sub-bucket value (e.g. http://edamontology.org/data_9090)
   * @returns {string} The friendly name if found, otherwise the same name
   * @memberof MapFriendlyValuesPipe
   */
  transform(key: string, subBucket: string | number): string {
    // Handle null or undefined
    if (subBucket === null || subBucket === undefined) {
      console.error('null/undefined passed into the pipe along with the key: ' + key);
      return null;
    }
    // Handle number
    const subBucketString: string = subBucket.toString();
    // Handle string
    if (this.friendlyValueNames.has(key) && this.friendlyValueNames.get(key).get(subBucketString)) {
      return this.friendlyValueNames.get(key).get(subBucketString);
    } else {
      return subBucketString;
    }
  }
}
