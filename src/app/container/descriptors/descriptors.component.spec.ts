import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DescriptorsService } from './descriptors.service';
import { FileService } from './../../shared/file.service';
import { ContainerService } from './../../shared/container.service';
import { Http } from '@angular/http';
import { HttpService } from './../../shared/http.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { DescriptorsComponent } from './descriptors.component';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { ContainerStubService } from '../../../../src/app/test/service-stubs';
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
        { provide: DescriptorsService, useClass: DescriptorsStubService },
        { provide: HighlightJsService, useClass: HighlightJsService },
        { provide: HttpService, useClass: HttpStubService },
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
