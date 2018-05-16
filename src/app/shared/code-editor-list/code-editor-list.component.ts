import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-code-editor-list',
  templateUrl: './code-editor-list.component.html',
  styleUrls: ['./code-editor-list.component.scss']
})
export class CodeEditorListComponent implements OnInit {
  @Input() sourcefiles: any;
  @Input() editing: boolean;
  constructor() { }

  ngOnInit() {
  }

  addFile() {
    // Need to properly get the type
    const newSourceFile = {
      content: '',
      path: '/testfile.wdl',
      type: 'DOCKSTORE_WDL'
    };
    this.sourcefiles.push(newSourceFile);
  }
}
