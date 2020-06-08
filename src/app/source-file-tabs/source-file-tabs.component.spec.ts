import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapFriendlyValuesPipe } from 'app/search/map-friendly-values.pipe';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { WorkflowsService } from 'app/shared/swagger';
import { DescriptorTypeCompatStubService, FileStubService, WorkflowsStubService } from 'app/test/service-stubs';
import { SourceFileTabsComponent } from './source-file-tabs.component';

describe('SourceFileTabsComponent', () => {
  let component: SourceFileTabsComponent;
  let fixture: ComponentFixture<SourceFileTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFileTabsComponent, MapFriendlyValuesPipe],
      providers: [
        { provide: FileService, useClass: FileStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: DescriptorTypeCompatService, useClass: DescriptorTypeCompatStubService }
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceFileTabsComponent);
    component = fixture.componentInstance;
    component.currentVersion = { id: 0 };
    component.workflowId = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
