import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolFileEditorComponent } from './tool-file-editor.component';
import { TabsModule } from 'ngx-bootstrap';
import { CodeEditorListComponent } from './../../shared/code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from './../../shared/code-editor/code-editor.component';
import { MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule, MatInputModule,
  MatFormFieldModule, MatSelectModule } from '@angular/material';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { ContainerService } from './../../shared/container.service';
import { RefreshService } from './../../shared/refresh.service';
import { HostedStubService, ContainerStubService, RefreshStubService } from './../../test/service-stubs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ToolFileEditorComponent', () => {
  let component: ToolFileEditorComponent;
  let fixture: ComponentFixture<ToolFileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolFileEditorComponent,
        CodeEditorListComponent,
        CodeEditorComponent
      ],
      imports: [
        TabsModule.forRoot(),
        MatButtonModule,
        MatTabsModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: HostedService, useClass: HostedStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: RefreshService, useClass: RefreshStubService }
      ]
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
