import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Collection, OrganisationUser } from '../../../shared/swagger';
import { AddEntryQuery } from '../state/add-entry.query';
import { AddEntryService } from '../state/add-entry.service';

@Component({
  selector: 'add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {
  public memberships$: Observable<Array<OrganisationUser>>;
  public collections$: Observable<Array<Collection>>;
  isLoading$: Observable<boolean>;
  selectedOrganisationId: number;
  selectedCollectionId: number;
  constructor(private addEntryQuery: AddEntryQuery,
              private addEntryService: AddEntryService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AddEntryComponent>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.addEntryQuery.isLoading$;
    this.addEntryService.updateMemberships();
    this.memberships$ = this.addEntryQuery.memberships$;
    this.collections$ = this.addEntryQuery.filteredCollections$;
  }

  /**
   * Called when organisation is selected from dropdown
   * @param event event.value is the id of the organisation to add
   */
  onOrganisationChange(event) {
    this.selectedCollectionId = null;
    this.addEntryService.updateCollections(event.value);
  }

  /**
   * Attempts to add the entry to the selected collection
   */
  addToCollection() {
    if (this.selectedCollectionId && this.selectedOrganisationId) {
      this.addEntryService.addEntryToCollection(this.selectedOrganisationId, this.selectedCollectionId, this.data.entryId);
    }
  }
}
