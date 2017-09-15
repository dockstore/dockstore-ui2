import { ContainersService } from '../../shared/swagger';
import {Component, Input, ElementRef, AfterViewChecked, AfterViewInit} from '@angular/core';

import { VersionSelector } from '../../shared/selectors/version-selector';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
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

  constructor(private highlightJsService: HighlightJsService,
              public fileService: FileService,
              private elementRef: ElementRef,
              private containerService: ContainerService, private containersService: ContainersService) {
    super();
    this.nullContent = false;
  }

  reactToVersion(): void {
    if (this.currentVersion) {
      this.nullContent = false;
      this.containersService.dockerfile(this.id, this.currentVersion.name)
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
