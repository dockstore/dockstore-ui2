/*
 *    Copyright 2018 OICR
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryTypeMetadataService } from '../../../entry/type-metadata/entry-type-metadata.service';
import { CheckerWorkflowStubService, EntryTypeMetadataStubService, RegisterCheckerWorkflowStubService } from '../../../test/service-stubs';
import { CheckerWorkflowService } from '../../state/checker-workflow.service';
import { RegisterCheckerWorkflowService } from '../register-checker-workflow/register-checker-workflow.service';
import { InfoTabCheckerWorkflowPathComponent } from './info-tab-checker-workflow-path.component';

describe('InfoTabCheckerWorkflowPathComponent', () => {
  let component: InfoTabCheckerWorkflowPathComponent;
  let fixture: ComponentFixture<InfoTabCheckerWorkflowPathComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule, MatDialogModule, InfoTabCheckerWorkflowPathComponent],
        providers: [
          { provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService },
          { provide: RegisterCheckerWorkflowService, useClass: RegisterCheckerWorkflowStubService },
          { provide: EntryTypeMetadataService, useClass: EntryTypeMetadataStubService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTabCheckerWorkflowPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
