import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesWorkflowComponent } from './files.component';

describe('FilesWorkflowComponent', () => {
  let component: FilesWorkflowComponent;
  let fixture: ComponentFixture<FilesWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesWorkflowComponent ]
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
