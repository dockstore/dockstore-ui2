import {Component, Input, ElementRef, AfterViewChecked, AfterViewInit} from '@angular/core';

import { VersionSelector } from '../../shared/selectors/version-selector';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { DockerfileService } from './dockerfile.service';
import { FileService } from '../../shared/file.service';
import { ContainerService } from '../../shared/container.service';

@Component({
  selector: 'app-dockerfile',
  templateUrl: './dockerfile.component.html',
})
export class DockerfileComponent extends VersionSelector implements AfterViewChecked {

  @Input() id: number;
  content: string;
  nullContent: boolean;
  contentHighlighted: boolean;

  constructor(private dockerfileService: DockerfileService,
              private highlightJsService: HighlightJsService,
              private fileService: FileService,
              private elementRef: ElementRef,
              private containerService: ContainerService) {
    super();
    this.nullContent = false;
  }

  reactToVersion(): void {
    if (this.currentVersion) {
      this.nullContent = false;
      this.dockerfileService.getDockerfile(this.id, this.currentVersion.name)
        .subscribe(file => {
            this.content = file.content;
            this.contentHighlighted = true;
          }
        );
    } else {
      this.nullContent = true;
    }
  }
  ngAfterViewChecked() {
    if (this.contentHighlighted && !this.nullContent) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }
  copyBtnSubscript(): void {
    this.containerService.copyBtn$.subscribe(
      copyBtn => {
          this.toolCopyBtn = copyBtn;
      });
  }
  toolCopyBtnClick(copyBtn): void {
    this.containerService.setCopyBtn(copyBtn);
  }

}
