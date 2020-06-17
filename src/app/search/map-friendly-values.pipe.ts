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
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { SourceFile, ToolFile, Workflow } from 'app/shared/swagger';

@Pipe({
  name: 'mapFriendlyValue'
})
export class MapFriendlyValuesPipe implements PipeTransform {
  readonly shortFriendlyCWLName = DescriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.CWL);
  readonly shortFriendlyWDLName = DescriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.WDL);
  readonly shortFriendlyNFLName = DescriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(Workflow.DescriptorTypeEnum.NFL);
  readonly shortFriendlyGalaxyName = DescriptorLanguageService.workflowDescriptorTypeEnumToShortFriendlyName(
    Workflow.DescriptorTypeEnum.Gxformat2
  );

  /**
   * Map containing what the friendly names should be mapped to
   *
   * @memberof MapFriendlyValuesPipe
   */
  readonly friendlyValueNames = new Map([
    ['has_checker', new Map([['1', 'has a checker workflow'], ['0', 'unchecked workflow']])],
    ['verified', new Map([['1', 'verified'], ['0', 'non-verified']])],
    ['private_access', new Map([['1', 'private'], ['0', 'public']])],
    [
      'descriptorType',
      new Map([
        ['cwl', this.shortFriendlyCWLName],
        ['wdl', this.shortFriendlyWDLName],
        ['nfl', this.shortFriendlyNFLName],
        ['NFL', this.shortFriendlyNFLName],
        [Workflow.DescriptorTypeEnum.Gxformat2, this.shortFriendlyGalaxyName]
      ])
    ],
    [
      'descriptor_type',
      new Map([
        ['cwl', this.shortFriendlyCWLName],
        ['CWL', this.shortFriendlyCWLName],
        ['wdl', this.shortFriendlyWDLName],
        ['WDL', this.shortFriendlyWDLName],
        ['nfl', this.shortFriendlyNFLName],
        ['NFL', this.shortFriendlyNFLName],
        [Workflow.DescriptorTypeEnum.Gxformat2, this.shortFriendlyGalaxyName]
      ])
    ],
    [
      'registry',
      new Map([
        ['QUAY_IO', 'Quay.io'],
        ['DOCKER_HUB', 'Docker Hub'],
        ['GITLAB', 'GitLab'],
        ['AMAZON_ECR', 'Amazon ECR'],
        ['SEVEN_BRIDGES', 'Seven Bridges']
      ])
    ],
    [
      'source_control_provider.keyword',
      new Map([['GITHUB', 'GitHub'], ['BITBUCKET', 'Bitbucket'], ['GITLAB', 'GitLab'], ['DOCKSTORE', 'Dockstore']])
    ],
    ['descriptor_tooltip', new Map([['CWL', 'Common Workflow Language'], ['WDL', 'Workflow Description Language'], ['NFL', 'Nextflow']])],
    ['author', new Map([['', 'n/a']])],
    [
      'ToolFile.FileTypeEnum',
      new Map([
        [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR, 'Primary Descriptor'],
        [ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR, 'Secondary Descriptors'],
        [ToolFile.FileTypeEnum.TESTFILE, 'Test Parameter Files'],
        [ToolFile.FileTypeEnum.CONTAINERFILE, 'Dockerfile'],
        [ToolFile.FileTypeEnum.OTHER, 'Files']
      ])
    ],
    [
      'SourceFile.TypeEnum',
      new Map([
        [SourceFile.TypeEnum.DOCKERFILE, 'Dockerfile'],
        [SourceFile.TypeEnum.DOCKSTORECWL, 'Descriptor Files'],
        [SourceFile.TypeEnum.DOCKSTOREWDL, 'Descriptor Files'],
        [SourceFile.TypeEnum.NEXTFLOW, 'Descriptor Files'],
        [SourceFile.TypeEnum.NEXTFLOWCONFIG, 'Descriptor Files'],
        [SourceFile.TypeEnum.DOCKSTOREGXFORMAT2, 'Descriptor Files'],
        [SourceFile.TypeEnum.CWLTESTJSON, 'Test Parameter Files'],
        [SourceFile.TypeEnum.WDLTESTJSON, 'Test Parameter Files'],
        [SourceFile.TypeEnum.NEXTFLOWTESTPARAMS, 'Test Parameter Files'],
        [SourceFile.TypeEnum.GXFORMAT2TESTFILE, 'Test Parameter Files'],
        [SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON, 'Test Parameter Files'],
        [SourceFile.TypeEnum.DOCKSTORESERVICEYML, 'Configuration'],
        [SourceFile.TypeEnum.DOCKSTOREYML, 'Configuration'],
        [SourceFile.TypeEnum.DOCKSTORESERVICEOTHER, 'Service Files']
      ])
    ],
    ['success', new Map([['true', 'Success'], ['false', 'Failed']])],
    ['type', new Map([['PUSH', 'Git Push'], ['DELETE', 'Git Delete'], ['INSTALL', 'Install']])]
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
