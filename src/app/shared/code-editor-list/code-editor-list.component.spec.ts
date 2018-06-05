import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorListComponent } from './code-editor-list.component';
import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { CodeEditorComponent } from './../code-editor/code-editor.component';

describe('CodeEditorListComponent', () => {
  let component: CodeEditorListComponent;
  let fixture: ComponentFixture<CodeEditorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CodeEditorListComponent,
        CodeEditorComponent
      ],
      imports: [
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule
      ]
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
