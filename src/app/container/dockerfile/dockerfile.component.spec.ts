import { ContainerService } from './../../shared/container.service';
import { FileStubService, ContainerStubService } from './../../test/service-stubs';
import { FileService } from './../../shared/file.service';
import { DockerfileService } from './dockerfile.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { DockerfileComponent } from './dockerfile.component';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
class DockerFileStubService { }

describe('DockerfileComponent', () => {
  let component: DockerfileComponent;
  let fixture: ComponentFixture<DockerfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerfileComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [HighlightJsService, { provide: DockerfileService, useClass: DockerFileStubService },
        { provide: FileService, useClass: FileStubService },
        { provide: ContainerService, useClass: ContainerStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
