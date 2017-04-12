import { Component, Input, OnInit } from '@angular/core';

import { HighlightJsService } from 'angular2-highlight-js';

import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html'
})
export class ParamfilesWorkflowComponent implements OnInit {
  @Input() tool;
  @Input() versions;

  /*
    key: tag name
    value:
      key: descriptor
      value: array of file paths
  */
  versionMap;

  /* options */
  versionWithParamNames;
  filePaths;

  /* underlying objects for options */
  files;

  /* current */
  currentVersion;
  currentFile;

  /* file content */
  content;

  constructor(private highlightJsService: HighlightJsService,
              private dockstoreService: DockstoreService) { }

  onVersionChange(versionName: string): void {
    const version = this.dockstoreService.getVersion(this.versions, versionName);

    console.log(this.versionMap.get(versionName).get('cwl'));

    this.files = Array.from(this.versionMap.get(versionName).get('cwl'));
    this.filePaths = this.dockstoreService.getFilePaths(this.files);

    this.onFilePathChange(this.filePaths[0]);
  }

  onFilePathChange(path: string) {
    this.content = this.dockstoreService.highlightCode(this.dockstoreService.getFile(this.files, path).content);
  }

  ngOnInit() {
    this.versionMap = this.dockstoreService.getVersionMap(this.versions);

    if (this.versionMap.size > 0) {
      this.versionWithParamNames = Array.from(this.versionMap.keys());

      this.onVersionChange(this.versionWithParamNames[0]);
    }
  }
}
