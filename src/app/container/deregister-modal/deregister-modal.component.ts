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

import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ConfirmationDialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { RequestsService } from '../../loginComponents/state/requests.service';
import { bootstrap4mediumModalSize } from '../../shared/constants';
import { RegisterToolService } from './../register-tool/register-tool.service';

@Component({
  selector: 'app-deregister-modal',
  templateUrl: './deregister-modal.component.html',
  styleUrls: ['./deregister-modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() confirmationDialogData: ConfirmationDialogData;
  @Input() toolTipMessage: string;
  @Input() refreshMessage: boolean;
  @Input() option: string;
  @Input() organizationID: number;
  @Input() organizationStatus: string;
  @Input() organizationName: string;

  constructor(
    private registerToolService: RegisterToolService,
    private confirmationDialogService: ConfirmationDialogService,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {}

  deregisterTool() {
    this.registerToolService.deregisterTool();
  }

  deregisterOrganization(id: number) {
    this.requestsService.deleteOrganization(id);
  }

  openDeleteDialog() {
    this.confirmationDialogService
      .openDialog(this.confirmationDialogData, bootstrap4mediumModalSize)
      .pipe(first())
      .subscribe(result => {
        console.log(this.organizationID);
        if (result) {
          switch (this.option) {
            case 'tool':
              this.deregisterTool();
              break;
            case 'organization':
              this.deregisterOrganization(this.organizationID);
              break;
          }
        }
      });
  }
}
