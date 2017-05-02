import { Component, Input, OnInit } from '@angular/core';

import { HighlightJsService } from 'angular2-highlight-js';

import { ContainerService } from '../container/container.service';
import { ParamFilesService } from './paramfiles.service';
import { FileService } from '../shared/file.service'
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
                private paramFilesService: ParamFilesService,
                private fileService: FileService) { }

  onVersionChange(tagName: string): void {
    this.descriptorTypes = Array.from(this.tagsMap.get(tagName).keys());
    this.onDescriptorChange(this.descriptorTypes[0], tagName);
  }

  onDescriptorChange(descriptorName: string, currentTag: string) {
    // List of files (path, content,etc)
    this.files = this.tagsMap.get(currentTag).get(descriptorName);
    // List of filePath
    this.filePaths = this.files.map(
      file => file.path
    );
    this.onPathChange(this.filePaths[0]);
  }

  onPathChange(path: string) {
    this.content = this.fileService.highlightCode(this.getFile(this.files, path).content);
  }

  getFile(files, path: string) {
      for (const file of files) {
        if (file.path === path) {
          return file;
        }
      }
    }

  ngOnInit() {
    this.tagsMap = this.paramFilesService.getTagsWithParam(this.toolId, this.validTags);

    if (this.tagsMap.size > 0) {
      this.tagNames = Array.from(this.tagsMap.keys());

      this.onVersionChange(this.tagNames[0]);
    }
  }
}
