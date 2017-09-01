import { WorkflowDescriptorService } from './workflow-descriptor.service';
import { Component, Input, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { WorkflowService } from '../../shared/workflow.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css']
})
export class DescriptorsWorkflowComponent extends FileSelector implements AfterViewChecked, OnInit {
  @Input() id: number;
  content: string;
  contentHighlighted: boolean;
  constructor(private highlightJsService: HighlightJsService,
              private WorkflowDescriptorService: WorkflowDescriptorService,
              public fileService: FileService,
              private workflowService: WorkflowService,
              private elementRef: ElementRef) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.workflowService.getDescriptors(this.versions, this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.WorkflowDescriptorService.getFiles(this.id, this.currentVersion.name, this.currentDescriptor, 'workflows');
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.contentHighlighted = true;
  }
  ngAfterViewChecked() {
    if (this.contentHighlighted) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }
  copyBtnSubscript(): void {
    this.workflowService.copyBtn$.subscribe(
      copyBtn => {
        this.workflowCopyBtn = copyBtn;
      });
  }
  workflowCopyBtnClick(copyBtn): void {
    this.workflowService.setCopyBtn(copyBtn);
  }
}
