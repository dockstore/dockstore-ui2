import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-editor-list',
  templateUrl: './code-editor-list.component.html',
  styleUrls: ['./code-editor-list.component.scss']
})
export class CodeEditorListComponent {
  @Input() sourcefiles: any;
  @Input() editing: boolean;
  @Input() descriptorType: string;
  @Input() fileType: string;
  constructor() { }

  addFile() {
    const newSourceFile = {
      content: '',
      path: this.getDefaultPath(),
      type: this.getFileType()
    };

    if (this.sourcefiles === undefined) {
      this.sourcefiles = [];
    }
    this.sourcefiles.push(newSourceFile);
  }

  deleteFile(index: number) {
    console.log('Deleting file ' + index);
    this.sourcefiles[index].content = null;
  }

  getFileType() {
    if (this.fileType === 'descriptor') {
      return 'DOCKSTORE_' + this.descriptorType.toUpperCase();
    } else if (this.fileType === 'testParam') {
      return this.descriptorType.toUpperCase() + '_TEST_JSON';
    } else {
      return null;
    }
  }

  getDefaultPath() {
    if (this.fileType === 'descriptor') {
      return '.' + this.descriptorType.toLowerCase();
    } else if (this.fileType === 'testParam') {
      return '.json';
    }
  }

  isPrimaryDescriptor(path: string) {
    return path === '/Dockstore.' + this.descriptorType.toLowerCase();
  }
}
