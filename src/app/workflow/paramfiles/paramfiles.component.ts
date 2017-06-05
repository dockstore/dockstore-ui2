import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WorkflowService } from '../workflow.service';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css']
})
export class ParamfilesWorkflowComponent extends FileSelector {
  @Input() id: number;
  content: string;

  constructor(private workflowService: WorkflowService,
              private paramfilesService: ParamfilesService,
              private fileService: FileService) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'workflow', this.currentVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.fileService.highlightCode(this.currentFile.content);
  }
}
