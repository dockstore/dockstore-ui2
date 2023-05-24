/*
 *    Copyright 2023 OICR, UCSC
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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DescriptorLanguageStubService } from '../../test/service-stubs';
import { ExecutionsTabComponent } from './executions-tab.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { CustomMaterialModule } from '../../shared/modules/material.module';

describe('ExecutionsTabComponent', () => {
  let component: ExecutionsTabComponent;
  let fixture: ComponentFixture<ExecutionsTabComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExecutionsTabComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [HttpClientTestingModule, CustomMaterialModule],
        providers: [{ provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService }, AlertService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
