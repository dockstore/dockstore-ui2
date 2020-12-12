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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { CheckerWorkflowStubService, DescriptorLanguageStubService, RegisterCheckerWorkflowStubService } from '../../../test/service-stubs';
import { DescriptorTypeCompatService } from '../../descriptor-type-compat.service';
import { CheckerWorkflowService } from '../../state/checker-workflow.service';
import { DescriptorLanguageService } from '../descriptor-language.service';
import { RegisterCheckerWorkflowComponent } from './register-checker-workflow.component';
import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';

describe('RegisterCheckerWorkflowComponent', () => {
  let component: RegisterCheckerWorkflowComponent;
  let fixture: ComponentFixture<RegisterCheckerWorkflowComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterCheckerWorkflowComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [FormsModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule, CustomMaterialModule],
        providers: [
          { provide: RegisterCheckerWorkflowService, useClass: RegisterCheckerWorkflowStubService },
          { provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService },
          DescriptorTypeCompatService,
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCheckerWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
