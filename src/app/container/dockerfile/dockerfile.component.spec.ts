import { ContainersService } from '../../shared/swagger';
import { ContainerService } from './../../shared/container.service';
import { FileStubService, ContainerStubService, ContainersStubService } from './../../test/service-stubs';
import { FileService } from './../../shared/file.service';
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
      providers: [HighlightJsService,
        { provide: FileService, useClass: FileStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: ContainersService, useClass: ContainersStubService}
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
