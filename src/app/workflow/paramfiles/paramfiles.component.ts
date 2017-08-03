import {Component, Input, OnInit, ElementRef, AfterViewChecked} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';
import { WorkflowService } from '../../shared/workflow.service';

@Component({
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css']
})
export class ParamfilesWorkflowComponent extends FileSelector implements AfterViewChecked {
  @Input() id: number;
  content: string;

  contentHighlighted: boolean;

  constructor(private paramfilesService: ParamfilesService,
              private highlightJsService: HighlightJsService,
              private fileService: FileService,
              private elementRef: ElementRef,
              private workflowService: WorkflowService) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'workflows', this.currentVersion.name, this.currentDescriptor);
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
