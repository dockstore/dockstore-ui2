import { Component, OnInit, Input } from '@angular/core';
import { Files } from '../../shared/files';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.scss']
})
export class FileEditorComponent extends Files implements OnInit {
  descriptorFiles: Array<any>;
  testParameterFiles: Array<any>;
  _selectedVersion: WorkflowVersion;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this._selectedVersion = value;
    this.loadVersionSourcefiles();
  }
  constructor() {
    super();
  }

  ngOnInit() {
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  deleteVersion() {
    console.log('Delete Version');
  }

  /**
   * Splits up the sourcefiles for the version into descroptor files and test parameter files
   * @return void
   */
  loadVersionSourcefiles() {
    this.descriptorFiles = [];
    this.testParameterFiles = [];
    for (const sourcefile of this._selectedVersion.sourceFiles) {
      if (sourcefile.type === 'DOCKSTORE_WDL' || sourcefile.type === 'DOCKSTORE_CWL') {
        this.descriptorFiles.push(sourcefile);
      } else if (sourcefile.type === 'WDL_TEST_JSON' || sourcefile.type === 'CWL_TEST_JSON') {
        this.testParameterFiles.push(sourcefile);
      }
    }
  }
}
