import {Component, Input, ElementRef, AfterViewChecked} from '@angular/core';

import { VersionSelector } from '../../shared/selectors/version-selector';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { DockerfileService } from './dockerfile.service';
import { FileService } from '../../shared/file.service';


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
              private elementRef: ElementRef) {
    super();
    this.nullContent = false;
  }

  reactToVersion(): void {
    if (this.currentVersion) {
      this.nullContent = false;
      this.dockerfileService.getDockerfile(this.id, this.currentVersion.name)
        .subscribe(file => {
            this.content = this.fileService.highlightCode(file.content);
            this.contentHighlighted = true;
          }
        );
    } else {
      this.nullContent = true;
    }
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }

}
