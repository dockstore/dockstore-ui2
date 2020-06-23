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
import { Directive, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';
import { DockstoreService } from '../shared/dockstore.service';
import { EntryTab } from '../shared/entry/entry-tab';
import { Tag } from '../shared/swagger/model/tag';
import { WorkflowVersion } from './../shared/swagger/model/workflowVersion';
import { DateService } from './date.service';
import { SessionQuery } from './session/session.query';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Tooltip } from './tooltip';

@Directive()
export abstract class Versions extends EntryTab {
  @Input() versions: Array<Tag | WorkflowVersion>;
  @Input() verifiedSource: Array<any>;
  sortColumn: string;
  sortReverse: boolean;
  publicPage: boolean;
  defaultVersion: string;
  verifiedLink: string;
  dtOptions;
  displayedColumns: string[];
  readonly verifiedVersionTooltip = 'A version has a verified platform if it has been verified to work by a third party';

  abstract setNoOrderCols(): Array<number>;
  abstract setDisplayColumns(publicPage: boolean): void;
  constructor(protected dockstoreService: DockstoreService, private dateService: DateService, protected sessionQuery: SessionQuery) {
    // By default, sort by last_built for tools and last_modified for workflows, latest first
    super();
    this.sortReverse = true;
  }

  publicPageSubscription() {
    this.verifiedLink = this.dateService.getVerifiedLink();
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(publicPage => {
      this.publicPage = publicPage;
      this.setDisplayColumns(publicPage);
    });
  }

  getDefaultTooltip(publicPage: boolean): string {
    if (publicPage) {
      return Tooltip.defaultVersionUser;
    } else {
      return Tooltip.defaultVersionAuthor;
    }
  }

  clickSortColumn(columnName) {
    if (this.sortColumn === columnName) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortColumn = columnName;
      this.sortReverse = false;
    }
  }
  getIconClass(columnName): IconDefinition {
    return this.dockstoreService.getIconClass(columnName, this.sortColumn, this.sortReverse);
  }
  convertSorting(mode): string | undefined {
    if (mode && mode === DockstoreTool.ModeEnum.HOSTED) {
      this.sortColumn = 'id';
    }
    return this.sortReverse ? '-' + this.sortColumn : this.sortColumn;
  }
  getDateTimeString(timestamp) {
    if (timestamp) {
      return this.dateService.getDateTimeMessage(timestamp);
    } else {
      return 'n/a';
    }
  }

  getVerifiedSource(name: string): string {
    return this.dockstoreService.getVerifiedSource(name, this.verifiedSource);
  }
}
