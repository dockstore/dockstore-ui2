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
    console.log('adding file');
  }

}
