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
import { Component, Input } from '@angular/core';
import { ContainersService } from 'app/shared/swagger';
import { ToolQuery } from 'app/shared/tool/tool.query';
import { ToolService } from 'app/shared/tool/tool.service';
import { EMPTY, from } from 'rxjs';
import { catchError, concatMap, takeUntil } from 'rxjs/operators';
import { OrgToolObject } from '../../mytools/my-tool/my-tool.component';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { RefreshOrganizationComponent } from '../../shared/refresh-organization/refresh-organization.component';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'app-refresh-tool-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css'],
})
export class RefreshToolOrganizationComponent extends RefreshOrganizationComponent {
  @Input() protected orgToolObject: OrgToolObject<DockstoreTool>;

  constructor(
    userQuery: UserQuery,
    private alertService: AlertService,
    protected alertQuery: AlertQuery,
    private toolService: ToolService,
    private containersService: ContainersService,
    private toolQuery: ToolQuery
  ) {
    super(userQuery, alertQuery);
    this.buttonText = 'Refresh Namespace';
    this.tooltipText = 'Refresh all tools in the namespace';
  }

  refreshOrganization(): void {
    if (this.orgToolObject) {
      const entries: DockstoreTool[] = this.orgToolObject.published
        .concat(this.orgToolObject.unpublished)
        .filter((entry) => entry.mode !== DockstoreTool.ModeEnum.HOSTED && entry.gitUrl);
      from(entries)
        .pipe(
          concatMap((entry) => {
            this.alertService.start(`Refreshing ${entry.tool_path}`);
            return this.containersService.refresh(entry.id).pipe(
              catchError((error) => {
                this.alertService.detailedError(error);
                return EMPTY;
              })
            );
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
          (entry) => {
            const activeID = this.toolQuery.getActive().id;
            if (activeID === entry.id) {
              // Warning: this may result in an incomplete tool (missing validation, aliases etc)
              this.toolService.setTool(entry);
            }
            this.alertService.detailedSuccess();
          },
          // This is likely redundant because it was already caught in the inner observable
          (error) => this.alertService.detailedError(error)
        );
    }
  }
}
