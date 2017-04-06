import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { HighlightJsService } from 'angular2-highlight-js';
import { DockerfileService } from './dockerfile.service';

@Component({
  selector: 'app-dockerfile',
  templateUrl: './dockerfile.component.html',
  providers: [DockerfileService]
})
export class DockerfileComponent implements OnInit {
  @Input() toolId: number;
  @Input() validTags;
  @Input() defaultTag;

  content;
  currentTag;

  constructor(private dockerfileService: DockerfileService, private highlightJsService: HighlightJsService) { }

  highlightByService(target: ElementRef) {
      this.highlightJsService.highlight(target);
  }

  onVersionChange(tag): void {
    this.dockerfileService.getDescriptorFile(this.toolId, tag)
      .subscribe(
        (object) => {
          this.content = '<pre><code class="YAML highlight">' + object.content + '</code></pre>';
        }
      );
  }

  ngOnInit() {
    this.onVersionChange(this.defaultTag);
  }

}
