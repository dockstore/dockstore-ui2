import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapFriendlyValuesPipe } from 'app/search/map-friendly-values.pipe';
import { FileService } from 'app/shared/file.service';
import { FileStubService, SourceFileTabsStubService } from 'app/test/service-stubs';
import { SourceFileTabsComponent } from './source-file-tabs.component';
import { SourceFileTabsService } from './source-file-tabs.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SourceFileTabsComponent', () => {
  let component: SourceFileTabsComponent;
  let fixture: ComponentFixture<SourceFileTabsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [MatDialogModule, RouterTestingModule, SourceFileTabsComponent, MapFriendlyValuesPipe],
        providers: [
          { provide: SourceFileTabsService, useClass: SourceFileTabsStubService },
          { provide: FileService, useClass: FileStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
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
