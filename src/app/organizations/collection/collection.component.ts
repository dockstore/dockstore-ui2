import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { bootstrap4mediumModalSize } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrgLogoService } from '../../shared/org-logo.service';
import { Collection, Organization } from '../../shared/swagger';
import { Collection as OpenAPICollection, OrganizationsService } from '../../shared/openapi';
import { ToolDescriptor } from '../../shared/swagger/model/toolDescriptor';
import { Workflow } from '../../shared/swagger/model/workflow';
import { UserQuery } from '../../shared/user/user.query';
import { ActivatedRoute } from '../../test';
import { CreateCollectionComponent } from '../collections/create-collection/create-collection.component';
import { CollectionDialogData, RemoveCollectionDialogComponent } from '../collections/remove-collection/remove-collection.component';
// eslint-disable-next-line max-len
import { UpdateOrganizationOrCollectionDescriptionComponent } from '../organization/update-organization-description/update-organization-description.component';
import { CollectionsQuery } from '../state/collections.query';
import { CollectionsService } from '../state/collections.service';
import { OrganizationQuery } from '../state/organization.query';
import { EntryType } from 'app/shared/enum/entry-type';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../shared/alert/state/alert.service';

@Component({
  selector: 'app-collection-entry-confirm-remove',
  templateUrl: 'collection-entry-confirm-remove.html',
})
export class CollectionRemoveEntryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EntryDialogData, private collectionsService: CollectionsService) {}
  deleteCollection() {
    this.collectionsService.removeEntryFromCollection(
      this.data.organizationId,
      this.data.collectionId,
      this.data.entryId,
      this.data.entryName,
      this.data.versionName
    );
  }
}

export interface EntryDialogData {
  collectionName: string;
  collectionId: number;
  entryName: string;
  entryId: number;
  organizationId: number;
  versionName: string | null;
}

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss', '../organization/organization.component.scss'],
})
export class CollectionComponent implements OnInit {
  entryType = EntryType;
  WorkflowMode = Workflow.ModeEnum;
  DescriptorType = ToolDescriptor.TypeEnum;
  collection$: Observable<Collection>;
  openAPICollection: OpenAPICollection;
  loadingCollection$: Observable<boolean>;

  organization$: Observable<Organization>;
  loadingOrganization$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  canDelete$: Observable<boolean>;
  pendingEnum = Organization.StatusEnum.PENDING;

  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;

  constructor(
    private collectionsQuery: CollectionsQuery,
    private organizationQuery: OrganizationQuery,
    private organizationsService: OrganizationsService,
    private collectionsService: CollectionsService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private userQuery: UserQuery,
    public orgLogoService: OrgLogoService
  ) {}

  ngOnInit() {
    const organizationName = this.activatedRoute.snapshot.paramMap.get('organizationName');
    const collectionName = this.activatedRoute.snapshot.paramMap.get('collectionName');
    this.loadingCollection$ = this.collectionsQuery.loading$;
    this.collection$ = this.collectionsQuery.selectActive();
    this.loadingOrganization$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.canDelete$ = this.organizationQuery.canDeleteCollection$;
    this.organization$ = this.organizationQuery.organization$;
    this.collectionsService.updateCollectionFromName(organizationName, collectionName);
    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
    this.organizationsService.getCollectionByName(organizationName, collectionName).subscribe(
      (openAPICollection) => {
        this.openAPICollection = openAPICollection;
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  checkHasOnlyNotebooks(collection: Collection): boolean {
    return collection.entries.length === this.openAPICollection.notebooksLength;
  }

  /**
   * Opens a dialog which confirms the removal of an entry from a collection
   * @param organizationId
   * @param collectionId
   * @param entryId
   * @param collectionName
   * @param entryName
   */
  openRemoveEntryDialog(
    organizationId: number,
    collectionId: number,
    entryId: number,
    collectionName: string,
    entryName: string,
    versionName: string | null
  ) {
    const data: EntryDialogData = {
      collectionName: collectionName,
      entryName: entryName,
      collectionId: collectionId,
      entryId: entryId,
      organizationId: organizationId,
      versionName: versionName,
    };
    this.dialog.open(CollectionRemoveEntryDialogComponent, {
      width: '500px',
      data: data,
    });
  }

  editCollection(collection: Collection) {
    const collectionMap = { key: collection.id, value: collection };
    this.dialog.open(CreateCollectionComponent, {
      data: { collection: collectionMap, mode: TagEditorMode.Edit },
      width: '600px',
    });
  }

  removeCollection(organization: Organization, collection: Collection) {
    const data: CollectionDialogData = {
      organizationId: organization.id,
      collectionId: collection.id,
      organizationName: organization.name,
      collectionName: collection.name,
    };
    this.dialog.open(RemoveCollectionDialogComponent, {
      width: bootstrap4mediumModalSize,
      data: data,
    });
  }

  updateDescription(description: string, collectionId: number) {
    this.dialog.open(UpdateOrganizationOrCollectionDescriptionComponent, {
      data: { description: description, type: 'collection', collectionId: collectionId },
      width: '600px',
    });
  }

  protected readonly Dockstore = Dockstore;
}
