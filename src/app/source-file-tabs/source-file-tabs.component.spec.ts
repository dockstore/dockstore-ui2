import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapFriendlyValuesPipe } from 'app/search/map-friendly-values.pipe';
import { FileService } from 'app/shared/file.service';
import { FileStubService, SourceFileTabsStubService } from 'app/test/service-stubs';
import { SourceFileTabsComponent } from './source-file-tabs.component';
import { SourceFileTabsService } from './source-file-tabs.service';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';

describe('SourceFileTabsComponent', () => {
  let component: SourceFileTabsComponent;
  let fixture: ComponentFixture<SourceFileTabsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule, SourceFileTabsComponent, MapFriendlyValuesPipe],
        providers: [
          { provide: SourceFileTabsService, useClass: SourceFileTabsStubService },
          { provide: FileService, useClass: FileStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceFileTabsComponent);
    component = fixture.componentInstance;
    component.version = { id: 0, name: 'abc', reference: '1' };
    component.entry = {
      type: '',
      defaultTestParameterFilePath: '',
      descriptorType: undefined,
      descriptorTypeSubclass: undefined,
      gitUrl: '',
      mode: undefined,
      organization: '',
      repository: '',
      sourceControl: null,
      workflow_path: '',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
