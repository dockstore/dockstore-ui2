import { Component, Input, OnInit } from '@angular/core';

import { HighlightJsService } from 'angular2-highlight-js';

import { ContainerService } from '../container/container.service';
import { ParamFilesService } from './paramfiles.service';

@Component({
  selector: 'app-paramfiles',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css'],
  providers: [ParamFilesService]
})
export class ParamfilesComponent implements OnInit {
  @Input() toolId: number;
  @Input() validTags;

  /*
    key: tag name
    value:
      key: descriptor
      value: array of file paths
  */
  tagsMap;

  // options
  tagNames;
  descriptorTypes;
  filePaths;

  // objects for options
  private files;

  // currently selected option
  currentTag: string;
  currentDescriptor: string;

  // file content
  content;

  constructor(private highlightJsService: HighlightJsService,
                private containerService: ContainerService,
                private paramFilesService: ParamFilesService) { }

  onVersionChange(tagName: string): void {
    this.descriptorTypes = Array.from(this.tagsMap.get(tagName).keys());
    this.onDescriptorChange(this.descriptorTypes[0], tagName);
  }

  onDescriptorChange(descriptorName: string, currentTag: string) {
    this.files = this.tagsMap.get(currentTag).get(descriptorName);
    this.filePaths = this.files.map(
      file => this.containerService.getFilePath(file)
    );
    this.onPathChange(this.filePaths[0]);
  }

  onPathChange(path: string) {
    this.content = this.containerService.highlightCode(this.containerService.getFile(path, this.files).content);
  }

  ngOnInit() {
    this.tagsMap = this.containerService.getTagsWithParams(this.validTags);

    if (this.tagsMap.size > 0) {
      this.tagNames = Array.from(this.tagsMap.keys());

      this.onVersionChange(this.tagNames[0]);
    }
  }
}
