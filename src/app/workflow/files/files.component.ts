import { Component, OnInit, OnChanges } from '@angular/core';
import { Files } from '../../shared/files';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';

@Component({
  selector: 'app-files-workflow',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesWorkflowComponent extends Files implements OnInit, OnChanges {
  versionsWithParamfiles: Array<any>;
  constructor(private paramfilesService: ParamfilesService) {
    super();
  }

  ngOnInit() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }
  ngOnChanges() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }

}
