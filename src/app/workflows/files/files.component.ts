import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-files-workflow',
  templateUrl: './files.component.html'
})
export class FilesWorkflowComponent {
  @Input() tool: number;
  @Input() validVersions;
  @Input() validVersionNames;
  @Input() defaultVersion;
}
