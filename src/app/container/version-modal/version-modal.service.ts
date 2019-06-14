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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Tag } from '../../shared/swagger';

@Injectable()
export class VersionModalService {
  mode: Subject<TagEditorMode> = new BehaviorSubject<TagEditorMode>(null);
  unsavedTestCWLFile: Subject<string> = new BehaviorSubject<string>('');
  unsavedTestWDLFile: Subject<string> = new BehaviorSubject<string>('');
  version: Subject<Tag> = new BehaviorSubject<Tag>(null);
  public setCurrentMode(mode: TagEditorMode): void {
    this.mode.next(mode);
  }

  public setVersion(version: Tag) {
    this.version.next(version);
  }

  public setCurrentUnsavedTestWDLFile(file: string): void {
    this.unsavedTestWDLFile.next(file);
  }

  public setCurrentUnsavedTestCWLFile(file: string): void {
    this.unsavedTestCWLFile.next(file);
  }

  getSizeString(size: number) {
    let sizeStr = '';

    if (size) {
      const exp = Math.log(size) / Math.log(2);
      if (exp < 10) {
        sizeStr = size.toFixed(2) + ' bytes';
      } else if (exp < 20) {
        sizeStr = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
      } else if (exp < 30) {
        sizeStr = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
      } else if (exp < 40) {
        sizeStr = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
      }
    }

    return sizeStr;
  }
  constructor() {}
}
