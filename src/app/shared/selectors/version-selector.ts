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

import {Input, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {ContainerService} from '../container.service';

export abstract class VersionSelector implements OnInit, OnChanges, OnDestroy {

  @Input() versions;
  @Input() default;

  protected currentVersion;
  protected workflowCopyBtn: string;
  protected toolCopyBtn: string;

  abstract reactToVersion(): void;
  abstract copyBtnSubscript(): void;

  onVersionChange(version) {
    this.currentVersion = version;
    this.reactToVersion();
  }

  ngOnInit() {
    this.onVersionChange(this.default);
    this.copyBtnSubscript();
  }

  ngOnChanges(changeRecord) {
    this.onVersionChange(this.default);
  }
  ngOnDestroy() {
  }
}
