import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from 'angular2-highlight-js';

import { ContainerService } from '../container.service';
import { DescriptorsService } from './descriptors.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [DescriptorsService]
})

export class DescriptorsComponent extends FileSelector {

  @Input() id: number;
  content: string;

  constructor(private containerService: ContainerService,
              private descriptorsService: DescriptorsService,
              private fileService: FileService) {
    super();
  }

  getDescriptors(version): Array<any> {
    return this.containerService.getDescriptors(this.versions, this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.descriptorsService.getFiles(this.id, this.currentVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.fileService.highlightCode(this.currentFile.content);
  }
}
