import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { SourceFile } from 'app/shared/swagger';
import { DateService } from '../shared/date.service';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { ProviderService } from '../shared/provider.service';
import { SourceFileTabsService } from '../source-file-tabs/source-file-tabs.service';
import { DateStubService, DescriptorLanguageStubService, InfoTabServiceStub, SourceFileTabsStubService } from '../test/service-stubs';
import { InfoTabService } from '../workflow/info-tab/info-tab.service';

import { FileTreeComponent } from './file-tree.component';

describe('FileTreeComponent', () => {
  let component: FileTreeComponent;
  let fixture: ComponentFixture<FileTreeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FileTreeComponent],
        imports: [MatButtonModule, MatIconModule, MatTreeModule, MatDialogModule, HttpClientTestingModule],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] },
          { provide: SourceFileTabsService, useClass: SourceFileTabsService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService },
          { provide: InfoTabService, useClass: InfoTabServiceStub },
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
      { absolutePath: '/folder1/file1', path: 'file1', type: SourceFile.TypeEnum.DOCKSTOREWDL },
      { absolutePath: '/folder1/file2', path: 'file2', type: SourceFile.TypeEnum.DOCKSTOREWDL },
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
