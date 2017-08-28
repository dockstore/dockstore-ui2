import { ParamFilesStubService } from './../../test/service-stubs';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesWorkflowComponent } from './files.component';

describe('FilesWorkflowComponent', () => {
  let component: FilesWorkflowComponent;
  let fixture: ComponentFixture<FilesWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesWorkflowComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [{provide: ParamfilesService, useClass: ParamFilesStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
