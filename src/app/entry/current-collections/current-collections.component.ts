import { Component, Input, OnChanges, OnInit, SimpleChanges, Version } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AddEntryComponent } from '../../organizations/collection/add-entry/add-entry.component';
import { CollectionOrganization } from '../../shared/swagger';
import { TrackLoginService } from '../../shared/track-login.service';
import { CurrentCollectionsQuery } from '../state/current-collections.query';
import { CurrentCollectionsService } from '../state/current-collections.service';
import { OrgLogoService } from '../../shared/org-logo.service';

@Component({
  selector: 'app-current-collections',
  templateUrl: './current-collections.component.html',
  styleUrls: ['./current-collections.component.scss'],
})
export class CurrentCollectionsComponent implements OnInit, OnChanges {
  @Input() id: number;
  // This is bad, should not have an input that's only passed down the chain
  @Input() versions: Version[];
  currentCollections$: Observable<CollectionOrganization[]>;
  isLoading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private currentCollectionsQuery: CurrentCollectionsQuery,
    private matDialog: MatDialog,
    private currentCollectionsService: CurrentCollectionsService,
    private trackLoginService: TrackLoginService,
    public orgLogoService: OrgLogoService
  ) {}

  ngOnInit() {
    this.currentCollections$ = this.currentCollectionsQuery.currentCollectionOrganizations$;
    this.isLoading$ = this.currentCollectionsQuery.selectLoading();
    this.isLoggedIn$ = this.trackLoginService.isLoggedIn$;
  }

  add(currentCollection: CollectionOrganization) {
    this.currentCollectionsService.add(currentCollection);
  }

  update(id: ID, currentCollection: Partial<CollectionOrganization>) {
    this.currentCollectionsService.update(id, currentCollection);
  }

  remove(id: ID) {
    this.currentCollectionsService.remove(id);
  }

  addEntryToCollection() {
    this.matDialog.open(AddEntryComponent, {
      data: { entryId: this.id, versions: this.versions },
      width: '500px',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentCollectionsService.get(this.id);
  }
}
