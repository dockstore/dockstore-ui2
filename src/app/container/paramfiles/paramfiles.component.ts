import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from 'angular2-highlight-js';

import { ContainerService } from '../container.service';
import { ParamfilesService } from './paramfiles.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html'
})

export class ParamfilesComponent extends FileSelector {

  @Input() id: number;
  content: string;

  constructor(private containerService: ContainerService,
              private paramfilesService: ParamfilesService,
              private fileService: FileService) {
    super();
  }

  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'container', this.currentVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.fileService.highlightCode(this.currentFile.content);
  }

}
