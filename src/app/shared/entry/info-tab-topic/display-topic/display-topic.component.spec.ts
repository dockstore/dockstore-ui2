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

import { DisplayTopicComponent } from './display-topic.component';
import { EntryTypeMetadataStubService } from 'app/test/service-stubs';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { sampleWorkflow1 } from 'app/test/mocked-objects';

describe('DisplayTopicComponent', () => {
  let component: DisplayTopicComponent;
  let fixture: ComponentFixture<DisplayTopicComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: EntryTypeMetadataService, useClass: EntryTypeMetadataStubService }],
        imports: [MatLegacyDialogModule, DisplayTopicComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTopicComponent);
    component = fixture.componentInstance;
    component.entry = sampleWorkflow1;
    component.disableEditing = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
