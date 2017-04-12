import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from 'angular2-highlight-js';

import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html'
})

export class DescriptorsWorkflowComponent implements OnInit {
  @Input() tool;
  @Input() versions;
  @Input() versionNames;
  @Input() defaultVersion;

  /* options */
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

    this.files = version.sourceFiles;
    this.filePaths = this.dockstoreService.getFilePaths(this.files);

    this.onFilePathChange(this.filePaths[0]);
  }

  onFilePathChange(filePath: string) {
    const file = this.dockstoreService.getFile(this.files, filePath);
    this.content = this.dockstoreService.highlightCode(file.content);
  }

  ngOnInit() {
    console.log(this.versions);
    this.currentVersion = this.defaultVersion;
    this.onVersionChange(this.defaultVersion);
  }

}
