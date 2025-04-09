import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Collection, OrganizationUser } from '../../../shared/openapi';
import { AddEntryQuery } from '../state/add-entry.query';
import { AddEntryService } from '../state/add-entry.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    LoadingComponent,
    FlexModule,
    NgIf,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class AddEntryComponent implements OnInit {
  public memberships$: Observable<Array<OrganizationUser>>;
  public collections$: Observable<Array<Collection>>;
  isLoading$: Observable<boolean>;
  selectedOrganizationId: number | null;
  selectedCollectionId: number | null;
  selectedVersionId: number | null;
  constructor(
    private addEntryQuery: AddEntryQuery,
    private addEntryService: AddEntryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEntryComponent>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.addEntryQuery.isLoading$;
    this.addEntryService.updateMemberships();
    this.memberships$ = this.addEntryQuery.memberships$;
    this.collections$ = this.addEntryQuery.collections$;
  }

  /**
   * Called when organization is selected from dropdown
   * @param event event.value is the id of the organization to add
   */
  onOrganizationChange(event) {
    this.selectedCollectionId = null;
    this.addEntryService.updateCollections(event.value);
  }

  /**
   * Attempts to add the entry to the selected collection
   */
  addToCollection() {
    if (this.selectedCollectionId && this.selectedOrganizationId) {
      this.addEntryService.addEntryToCollection(
        this.selectedOrganizationId,
        this.selectedCollectionId,
        this.data.entryId,
        this.selectedVersionId
      );
    }
  }
}
