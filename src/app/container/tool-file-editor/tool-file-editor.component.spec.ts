import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolFileEditorComponent } from './tool-file-editor.component';

describe('ToolFileEditorComponent', () => {
  let component: ToolFileEditorComponent;
  let fixture: ComponentFixture<ToolFileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolFileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
