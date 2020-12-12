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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { CommitUrlPipe } from '../../shared/entry/commit-url.pipe';
import { VerifiedPlatformsPipe } from '../../shared/entry/verified-platforms.pipe';
import { ImageProviderService } from '../../shared/image-provider.service';
import { OrderBy } from '../../shared/orderBy';
import { ProviderService } from '../../shared/provider.service';
import { RefreshService } from '../../shared/refresh.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import {
  DateStubService,
  ImageProviderStubService,
  RefreshStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from '../../test/service-stubs';
import { VersionsWorkflowComponent } from './versions.component';

@Component({
  selector: 'app-view-workflow',
  template: '<p>App View Component</p>',
})
class MockViewWorkflowComponent {
  @Input() versions;
  @Input() version;
  @Input() workflowId;
  @Input() canRead;
  @Input() canWrite;
  @Input() isOwner;
  @Input() defaultVersion;
}

@Component({
  selector: 'app-version-modal',
  template: '<p>Version Modal Component</p>',
})
class MockVersionModalComponent {
  @Input() canRead;
  @Input() canWrite;
  @Input() isOwner;
}

describe('VersionsWorkflowComponent', () => {
  let component: VersionsWorkflowComponent;
  let fixture: ComponentFixture<VersionsWorkflowComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CustomMaterialModule, FormsModule, FontAwesomeModule, BrowserAnimationsModule],
        declarations: [
          VersionsWorkflowComponent,
          OrderBy,
          CommitUrlPipe,
          VerifiedPlatformsPipe,
          MockViewWorkflowComponent,
          MockVersionModalComponent,
        ],
        providers: [
          DockstoreService,
          { provide: DateService, useClass: DateStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          AlertQuery,
          ProviderService,
          WorkflowQuery,
          { provide: ImageProviderService, useClass: ImageProviderStubService },
          { provide: RefreshService, useClass: RefreshStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionsWorkflowComponent);
    component = fixture.componentInstance;
    component.versions = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get verified source', () => {
    const source1 = { version: '1', verifiedSource: 'a' };
    const source2 = { version: '2', verifiedSource: 'b' };
    const source3 = { version: '3', verifiedSource: 'c' };
    component.verifiedSource = [source1, source2, source3];
    fixture.detectChanges();
    expect(component.getVerifiedSource('1')).toEqual('a');
    expect(component.getVerifiedSource('2')).toEqual('b');
    expect(component.getVerifiedSource('3')).toEqual('c');
    expect(component.getVerifiedSource('4')).toEqual('');
  });
});
