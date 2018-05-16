import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorListComponent } from './code-editor-list.component';

describe('CodeEditorListComponent', () => {
  let component: CodeEditorListComponent;
  let fixture: ComponentFixture<CodeEditorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeEditorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeEditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
