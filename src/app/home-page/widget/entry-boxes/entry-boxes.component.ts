import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entry-boxes',
  templateUrl: './entry-boxes.component.html',
  styleUrls: ['./entry-boxes.component.scss'],
})
export class EntryBoxesComponent implements OnInit {
  @Input() entryType: string;
  public EntryType = EntryType;
  constructor() {}

  ngOnInit(): void {
    this.entryType = 'BioWorkflow';
  }
}
