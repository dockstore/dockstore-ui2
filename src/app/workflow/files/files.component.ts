import { Component, OnInit, OnChanges } from '@angular/core';
import { Files } from '../../shared/files';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import {Subscription} from 'rxjs/Subscription';
import { WorkflowService } from '../../shared/workflow.service';

@Component({
  selector: 'app-files-workflow',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesWorkflowComponent extends Files implements OnInit, OnChanges {
  versionsWithParamfiles: Array<any>;
  private workflowSubscription: Subscription;
  constructor(private paramfilesService: ParamfilesService,
              private workflowService: WorkflowService) {
    super();
  }

  ngOnInit() {
    console.log('Files Component OnInit');
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
    this.workflowSubscription = this.workflowService.workflow$.subscribe(
      workflow => {
        console.log(workflow);
      }
    );
  }
  ngOnChanges() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }
}
