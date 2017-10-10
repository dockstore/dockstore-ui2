/*
 *    Copyright 2017 OICR
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

import { VersionSelector } from './version-selector';

export abstract class DescriptorSelector extends VersionSelector {

  protected currentDescriptor;
  protected descriptors: Array<any>;
  public nullDescriptors: boolean;

  abstract getDescriptors(version): Array<any>;
  abstract reactToDescriptor(): void;

  reactToVersion(): void {
    this.descriptors = this.getDescriptors(this.currentVersion);
    if (this.descriptors) {
      this.nullDescriptors = false;
      if (this.descriptors.length) {
        this.onDescriptorChange(this.descriptors[0]);
      }
    } else {
      this.nullDescriptors = true;
    }
  }
  onDescriptorChange(descriptor) {
    this.currentDescriptor = descriptor;
    this.reactToDescriptor();
  }
  copyBtnSubscript(): void {
  }
}
