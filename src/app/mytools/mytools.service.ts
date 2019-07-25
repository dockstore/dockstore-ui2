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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { ContainerService } from 'app/shared/container.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { UsersService } from 'app/shared/swagger';
import { finalize } from 'rxjs/operators';
import { MyEntriesService } from './../shared/myentries.service';

@Injectable()
export class MytoolsService extends MyEntriesService {
  constructor(
    private alertService: AlertService,
    private usersService: UsersService,
    private containerService: ContainerService,
    private myEntriesService: MyEntriesStateService
  ) {
    super();
  }
  getGroupIndex(groupEntries: any[], group: string): number {
    return groupEntries.findIndex(nsContainer => nsContainer.namespace === group);
  }

  getMyEntries(userId: number, entryType: EntryType) {
    this.alertService.start('Fetching tools');
    this.myEntriesService.setRefreshingMyEntries(true);
    this.usersService
      .userContainers(userId)
      .pipe(finalize(() => this.myEntriesService.setRefreshingMyEntries(false)))
      .subscribe(
        tools => {
          this.containerService.setTools(tools);
          this.alertService.simpleSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  registerEntry(entryType: EntryType) {}
}
