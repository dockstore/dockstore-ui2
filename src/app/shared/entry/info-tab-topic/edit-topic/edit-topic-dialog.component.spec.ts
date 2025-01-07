/*
 *    Copyright 2024 OICR and UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTopicDialogStubService, EntryActionsStubService, EntryTypeMetadataStubService } from 'app/test/service-stubs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { sampleWorkflow1 } from 'app/test/mocked-objects';
import { EditTopicDialogComponent } from './edit-topic-dialog.component';
import { EditTopicDialogService } from './edit-topic-dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntryActionsService } from 'app/shared/entry-actions/entry-actions.service';

describe('EditTopicDialogComponent', () => {
  let component: EditTopicDialogComponent;
  let fixture: ComponentFixture<EditTopicDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: EntryTypeMetadataService, useClass: EntryTypeMetadataStubService },
          { provide: EditTopicDialogService, useClass: EditTopicDialogStubService },
          { provide: EntryActionsService, useClass: EntryActionsStubService },
          {
            provide: MatDialogRef,
            useValue: {
              close: (dialogResult: any) => {},
            },
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { entry: sampleWorkflow1 },
          },
        ],
        imports: [EditTopicDialogComponent, BrowserAnimationsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTopicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
