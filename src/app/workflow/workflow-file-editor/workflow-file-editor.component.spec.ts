import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFileEditorComponent } from './workflow-file-editor.component';

describe('WorkflowFileEditorComponent', () => {
  let component: WorkflowFileEditorComponent;
  let fixture: ComponentFixture<WorkflowFileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowFileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
