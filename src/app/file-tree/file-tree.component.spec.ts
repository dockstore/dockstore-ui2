import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { SourceFile } from 'app/shared/swagger';

import { FileTreeComponent } from './file-tree.component';

describe('FileTreeComponent', () => {
  let component: FileTreeComponent;
  let fixture: ComponentFixture<FileTreeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FileTreeComponent],
        imports: [MatButtonModule, MatIconModule, MatTreeModule, MatDialogModule],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] },
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
