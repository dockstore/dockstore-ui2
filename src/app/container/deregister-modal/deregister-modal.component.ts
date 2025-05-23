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
import { first } from 'rxjs/operators';
import { ConfirmationDialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { bootstrap4mediumModalSize } from '../../shared/constants';
import { RegisterToolService } from './../register-tool/register-tool.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deregister-modal',
  templateUrl: './deregister-modal.component.html',
  styleUrls: ['./deregister-modal.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule],
})
export class ModalComponent {
  @Input() refreshMessage: boolean;

  constructor(private registerToolService: RegisterToolService, private confirmationDialogService: ConfirmationDialogService) {}
  deregister() {
    this.registerToolService.deregisterTool();
  }

  openDeleteDialog() {
    const confirmationDialogData: ConfirmationDialogData = {
      title: 'Are you sure you wish to delete this tool?',
      message: `All information associated with this tool will be deleted.`,
      cancelButtonText: 'Cancel',
      confirmationButtonText: 'Delete',
    };
    this.confirmationDialogService
      .openDialog(confirmationDialogData, bootstrap4mediumModalSize)
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.deregister();
        }
      });
  }
}
