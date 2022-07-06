import { Component, Input, OnChanges } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entry-boxes',
  templateUrl: './entry-boxes.component.html',
  styleUrls: ['./entry-boxes.component.scss'],
})
export class EntryBoxesComponent {
  @Input() entryType: string;
  constructor() {}

  //   ngOnChanges(): void {
  //     if (this.entryType === "Workflow") {
  //         EntryType = EntryType.BioWorkflow;
  //     }
  //   }
}
