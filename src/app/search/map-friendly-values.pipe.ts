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
import { DockstoreTool } from 'app/shared/openapi';
import { ToolFile, Workflow } from 'app/shared/swagger';

@Pipe({
  name: 'mapFriendlyValue',
})
export class MapFriendlyValuesPipe implements PipeTransform {
  constructor(private descriptorLanguageService: DescriptorLanguageService) {}

  // For instances in which we know it is nullable and don't need an console.error
  readonly nullableKeys = ['reference'];

  /**
   * Map containing what the friendly names should be mapped to
   *
   * @memberof MapFriendlyValuesPipe
   */
  readonly friendlyValueNames = new Map([
    [
      'mode',
      new Map([
        [Workflow.ModeEnum.FULL, 'Full'],
        [Workflow.ModeEnum.STUB, 'Stub'],
        [Workflow.ModeEnum.DOCKSTOREYML, 'Automatically synced via GitHub App'],
        [Workflow.ModeEnum.HOSTED, 'Hosted'],
        [DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS, 'Fully automated'],
        [DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSWITHMIXED, 'Partially automated'],
        [DockstoreTool.ModeEnum.MANUALIMAGEPATH, 'Manual'],
        [DockstoreTool.ModeEnum.HOSTED, 'Hosted'],
      ]),
    ],
    [
      'has_checker',
      new Map([
        ['1', 'has a checker workflow'],
        ['0', 'unchecked workflow'],
      ]),
    ],
    [
      'verified',
      new Map([
        ['1', 'verified'],
        ['0', 'non-verified'],
      ]),
    ],
    [
      'private_access',
      new Map([
        ['1', 'private'],
        ['0', 'public'],
      ]),
    ],
    [
      'registry',
      new Map([
        ['QUAY_IO', 'Quay.io'],
        ['DOCKER_HUB', 'Docker Hub'],
        ['GITLAB', 'GitLab'],
        ['AMAZON_ECR', 'Amazon ECR'],
        ['SEVEN_BRIDGES', 'Seven Bridges'],
      ]),
    ],
    [
      'source_control_provider.keyword',
      new Map([
        ['GITHUB', 'GitHub'],
        ['BITBUCKET', 'Bitbucket'],
        ['GITLAB', 'GitLab'],
        ['DOCKSTORE', 'Dockstore'],
      ]),
    ],
    ['author', new Map([['', 'n/a']])],
    [
      'ToolFile.FileTypeEnum',
      new Map([
        [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR, 'Primary Descriptor'],
        [ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR, 'Secondary Descriptors'],
        [ToolFile.FileTypeEnum.TESTFILE, 'Test Parameter Files'],
        [ToolFile.FileTypeEnum.CONTAINERFILE, 'Dockerfile'],
        [ToolFile.FileTypeEnum.OTHER, 'Files'],
      ]),
    ],
    [
      'success',
      new Map([
        ['true', 'Success'],
        ['false', 'Failed'],
      ]),
    ],
    [
      'type',
      new Map([
        ['PUSH', 'Push'],
        ['DELETE', 'Delete'],
        ['INSTALL', 'Install'],
      ]),
    ],
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
      if (!this.nullableKeys.includes(key)) {
        console.error('null/undefined passed into the pipe along with the key: ' + key);
      }
      return null;
    }
    // Handle number
    const subBucketString: string = subBucket.toString();

    switch (key) {
      case 'descriptorType':
      case 'descriptor_type':
        const shortFriendlyName =
          this.descriptorLanguageService.descriptorLanguageBeanValueToExtendedDescriptorLanguageBean(subBucketString).shortFriendlyName;
        if (shortFriendlyName) {
          return shortFriendlyName;
        } else {
          return subBucketString;
        }
      case 'descriptor_tooltip':
        const friendlyName =
          this.descriptorLanguageService.descriptorLanguageBeanValueToExtendedDescriptorLanguageBean(subBucketString).friendlyName;
        if (friendlyName) {
          return friendlyName;
        } else {
          return subBucketString;
        }
      case 'SourceFile.TypeEnum': {
        // Get the specific ExtendedDescriptorLanguageBean using subBucketString, which is the SourceFile.TypeEnum
        // Search through the file tabs
        // if the file types list for the tab contains the source file type (subBucketString)
        // then return the tabName, which is sort of a description of the file,
        // e.g. whether it is a descriptor or test file
        const fileTabsSchematic =
          this.descriptorLanguageService.sourceFileTypeStringToExtendedDescriptorLanguageBean(subBucketString).fileTabs;
        const fileTypes = fileTabsSchematic.find((fileTab) => fileTab.fileTypes.find((fileType) => fileType === subBucketString));
        if (fileTypes) {
          return fileTypes.tabName;
        } else {
          return subBucketString;
        }
      }
      default:
        // Handle string
        if (this.friendlyValueNames.has(key) && this.friendlyValueNames.get(key).get(subBucketString)) {
          return this.friendlyValueNames.get(key).get(subBucketString);
        } else {
          return subBucketString;
        }
    }
  }
}
