import { Component, Input } from '@angular/core';

import { VersionSelector } from '../../shared/selectors/version-selector';

import { HighlightJsService } from 'angular2-highlight-js';
import { DockerfileService } from './dockerfile.service';
import { FileService } from '../../shared/file.service';


@Component({
  selector: 'app-dockerfile',
  templateUrl: './dockerfile.component.html',
})
export class DockerfileComponent extends VersionSelector {

  @Input() id: number;
  content: string;

  constructor(private dockerfileService: DockerfileService,
              private highlightJsService: HighlightJsService,
              private fileService: FileService) {
    super();
  }

  reactToVersion(): void {
    this.dockerfileService.getDockerfile(this.id, this.currentVersion.name)
      .subscribe(file =>
        this.content = this.fileService.highlightCode(file.content)
      );
  }

}
