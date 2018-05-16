import { Component, OnInit, Input } from '@angular/core';
import { Files } from '../../shared/files';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { WorkflowService } from './../../shared/workflow.service';

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
  constructor(private hostedService: HostedService, private workflowService: WorkflowService) {
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

  saveVersion() {
    this.hostedService.editHostedWorkflow(
        this.id,
        this._selectedVersion.sourceFiles).subscribe(result => {
          this.toggleEdit();
          this.workflowService.setWorkflow(result);
        }, error =>  {
          if (error) {
              console.log(error);
          }
          // if (error) {
          //   if (error.status === 0) {
          //     this.setWorkflowRegisterError('The webservice is currently down, possibly due to load. ' +
          //     'Please wait and try again later.', '');
          //   } else {
          //     this.setWorkflowRegisterError('The webservice encountered an error trying to update this ' +
          //       'tool version, please ensure that the sourcefiles are valid ', '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
          //       error.error);
          //     }
          //   }
          }
        );
  }

  resetFiles() {
    console.log('Reset files');
  }
}
