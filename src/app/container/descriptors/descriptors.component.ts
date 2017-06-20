import { Component, Input, ElementRef, OnInit, AfterViewChecked} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { ContainerService } from '../../shared/container.service';
import { DescriptorsService } from './descriptors.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [DescriptorsService]
})

export class DescriptorsComponent extends FileSelector implements AfterViewChecked {

  @Input() id: number;
  content: string;
  contentHighlighted: boolean;

  constructor(private containerService: ContainerService,
              private highlightJsService: HighlightJsService,
              private descriptorsService: DescriptorsService,
              private fileService: FileService,
              private elementRef: ElementRef
  ) {
    super();
  }

  getDescriptors(version): Array<any> {
    return this.containerService.getDescriptors(this.versions, this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.descriptorsService.getFiles(this.id, this.currentVersion.name, this.currentDescriptor, 'containers');
  }

  reactToFile(): void {
    this.content = this.fileService.highlightCode(this.currentFile.content);
    this.contentHighlighted = true;
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }
}
