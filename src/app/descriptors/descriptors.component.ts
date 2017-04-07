import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from 'angular2-highlight-js';

import { ContainerService } from '../containers/container/container.service';
import { DescriptorsService } from './descriptors.service';

@Component({
  selector: 'app-descriptors',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css'],
  providers: [DescriptorsService]
})

export class DescriptorsComponent implements OnInit {
  @Input() toolId: number;
  @Input() validTags;
  @Input() validTagsNames;
  @Input() defaultTag;

  currentTagName: string;

  descriptorTypes;
  currentDescriptor;

  private files;
  filePaths;
  currentPath;

  content;

  constructor(private highlightJsService: HighlightJsService,
              private containerService: ContainerService,
              private descriptorsService: DescriptorsService) { }

  onVersionChange(tagName: string): void {
    let tag = this.containerService.getTag(this.validTags, tagName);
    this.currentTagName = tagName;

    this.descriptorTypes = this.containerService.getDescriptorTypes(this.validTags, tag);

    if (this.descriptorTypes && this.descriptorTypes.length) {
        this.onDescriptorChange(this.descriptorTypes[0]);
    }
  }

  getCwlFiles(tagName: string) {
    Observable.forkJoin([this.descriptorsService.getCwl(this.toolId, tagName), this.descriptorsService.getSecondaryCwl(this.toolId, tagName)]).subscribe(
      (cwlFiles) => {
        this.files = [];

        if (cwlFiles[1].length) {
          // if secondary cwl list is not empty, push cwl into list
          cwlFiles[1].push(cwlFiles[0]);
          this.files = cwlFiles[1];
        } else {
          // if secondary cwl list is empty, just use the cwl object
          this.files.push(cwlFiles[0]);
        }

        this.filePaths = this.files.map(
          (file) => {
            return file.path;
          }
        );

        this.onPathChange(this.filePaths[0]);
      }
    );
  }

  getWdlFiles(tagName: string) {
    Observable.forkJoin([this.descriptorsService.getWdl(this.toolId, tagName), this.descriptorsService.getSecondaryWdl(this.toolId, tagName)]).subscribe(
      (wdlFiles) => {
        this.files = [];

        if (wdlFiles[1].length) {
          // if secondary wdl list is not empty, push wdl into list
          wdlFiles[1].push(wdlFiles[0]);
          this.files = wdlFiles[1];
        } else {
          // if secondary wdl list is empty, just use the wdl object
          this.files.push(wdlFiles[0]);
        }

        this.filePaths = this.files.map(
          (file) => {
            return file.path;
          }
        );

        this.onPathChange(this.filePaths[0]);
      }
    );
  }

  getFile(path: string) {
    for (const file of this.files) {
      if (file.path === path) {
        return file;
      }
    }
  }

  onDescriptorChange(descriptorName: string) {
    this.currentDescriptor = descriptorName;
    if (descriptorName === 'cwl') {
      this.getCwlFiles(this.currentTagName);
    } else if (descriptorName === 'wdl') {
      this.getWdlFiles(this.currentTagName);
    }
  }

  onPathChange(path: string) {
    this.content = '<pre><code class="YAML highlight">' + this.getFile(path).content + '</pre></code>';

    this.currentPath = path;
  }

  ngOnInit() {
    this.onVersionChange(this.defaultTag);
  }

}
