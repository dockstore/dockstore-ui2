import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { ContainersStubService, ContainerStubService } from '../../../../src/app/test/service-stubs';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { ContainersService } from '../../shared/swagger';
import { ContainerService } from './../../shared/container.service';
import { FileService } from './../../shared/file.service';
import { DescriptorsComponent } from './descriptors.component';
import { ToolDescriptorService } from './tool-descriptor.service';

describe('DescriptorsComponent', () => {
  let component: DescriptorsComponent;
  let fixture: ComponentFixture<DescriptorsComponent>;

  class HttpStubService { }
  class FileStubService { }
  class HttpStub { }
  class DescriptorsStubService {
    getFiles(descriptor): Observable<any> {
      return null;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptorsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToolDescriptorService, useClass: DescriptorsStubService },
        { provide: HighlightJsService, useClass: HighlightJsService },
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: FileService, useClass: FileStubService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsComponent);
    component = fixture.componentInstance;
    component.id = 5;
    component.versions = null;
    component.default = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
