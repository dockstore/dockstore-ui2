import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SourceFile } from 'app/shared/openapi';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { DescriptorLanguageStubService, SourceFileTabsStubService } from '../test/service-stubs';

import { FileTreeComponent } from './file-tree.component';

describe('FileTreeComponent', () => {
  let component: FileTreeComponent;
  let fixture: ComponentFixture<FileTreeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          MatButtonModule,
          MatIconModule,
          MatTreeModule,
          MatDialogModule,
          HttpClientTestingModule,
          MatLegacyInputModule,
          BrowserAnimationsModule,
          FileTreeComponent,
        ],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] },
          { provide: SourceFileTabsService, useClass: SourceFileTabsStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the nodes from sourcefiles', () => {
    let sourcefiles: Array<SourceFile> = [];
    let expectedNodes = [];
    expect(component.convertSourceFilesToTree(sourcefiles)).toEqual(expectedNodes);
    sourcefiles = [
      { absolutePath: '/folder1/file1', path: 'file1', type: SourceFile.TypeEnum.DOCKSTOREWDL, state: SourceFile.StateEnum.COMPLETE },
      { absolutePath: '/folder1/file2', path: 'file2', type: SourceFile.TypeEnum.DOCKSTOREWDL, state: SourceFile.StateEnum.COMPLETE },
    ];
    expectedNodes = [
      Object({
        name: 'folder1',
        children: [
          Object({ name: 'file1', children: [], absolutePath: '/folder1/file1' }),
          Object({ name: 'file2', children: [], absolutePath: '/folder1/file2' }),
        ],
        absolutePath: '/folder1',
      }),
    ];
    expect(component.convertSourceFilesToTree(sourcefiles)).toEqual(expectedNodes);
  });
});
