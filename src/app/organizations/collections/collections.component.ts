import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CollectionsService } from '../state/collections.service';
import { CollectionsQuery } from '../state/collections.query';

@Component({
  selector: 'collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnChanges {
  @Input() organizationID: number;

  constructor(private collectionsQuery: CollectionsQuery,
              private collectionsService: CollectionsService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.collectionsService.updateCollections(this.organizationID);
  }
}
