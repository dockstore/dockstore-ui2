import { Component } from '@angular/core';

import { Files } from '../../shared/files';

import { ParamfilesService } from '../paramfiles/paramfiles.service';

@Component({
  selector: 'app-files-container',
  templateUrl: './files.component.html'
})
export class FilesContainerComponent extends Files {

  versionsWithParamfiles: Array<any>;

  constructor(private paramfilesService: ParamfilesService) {
    super();
  }

  ngOnInit() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }

}
