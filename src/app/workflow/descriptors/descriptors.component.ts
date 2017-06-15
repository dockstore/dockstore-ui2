import {Component, Input, ElementRef, OnInit, AfterViewChecked, AfterContentChecked} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { ContainerService } from '../../shared/container.service';
import { WorkflowService } from '../../shared/workflow.service';
import { DescriptorsService } from '../../container/descriptors/descriptors.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css']
})

export class DescriptorsWorkflowComponent extends FileSelector
  implements AfterContentChecked, AfterViewChecked, OnInit {
  @Input() id: number;
  content: string;
  contentHighlighted: boolean;
  private query;
  private isVisible;

  constructor(private containerService: ContainerService,
              private highlightJsService: HighlightJsService,
              private descriptorsService: DescriptorsService,
              private fileService: FileService,
              private workflowService: WorkflowService,
              private elementRef: ElementRef) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.workflowService.getDescriptors(this.versions, this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.descriptorsService.getFiles(this.id, this.currentVersion.name, this.currentDescriptor, 'workflows');
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

  ngAfterContentChecked() {
    this.isVisible = this.query.is(':visible');
  }

  ngOnInit() {
    this.query = $('#cy');
  }
}
