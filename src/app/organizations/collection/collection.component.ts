import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Collection, Organization } from '../../shared/swagger';
import { ToolDescriptor } from '../../shared/swagger/model/toolDescriptor';
import { Workflow } from '../../shared/swagger/model/workflow';
import { UserQuery } from '../../shared/user/user.query';
import { ActivatedRoute } from '../../test';
import { CreateCollectionComponent } from '../collections/create-collection/create-collection.component';
import { RemoveCollectionDialogComponent, CollectionDialogData } from '../collections/remove-collection/remove-collection.component';
// eslint-disable-next-line max-len
import { UpdateOrganizationOrCollectionDescriptionComponent } from '../organization/update-organization-description/update-organization-description.component';
import { CategoriesStateService } from '../../categories/state/categories.service';
import { CollectionsQuery } from '../state/collections.query';
import { CollectionsService } from '../state/collections.service';
import { OrganizationQuery } from '../state/organization.query';
import { bootstrap4mediumModalSize } from '../../shared/constants';

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
  WorkflowMode = Workflow.ModeEnum;
  DescriptorType = ToolDescriptor.TypeEnum;
  collection$: Observable<Collection>;
  loadingCollection$: Observable<boolean>;

  organization$: Observable<Collection>;
  loadingOrganization$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  canDelete$: Observable<boolean>;
  pendingEnum = Organization.StatusEnum.PENDING;
  gravatarUrl$: Observable<string>;

  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  constructor(
    private collectionsQuery: CollectionsQuery,
    private organizationQuery: OrganizationQuery,
    private collectionsService: CollectionsService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userQuery: UserQuery,
    public categoriesService: CategoriesStateService,
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
    this.gravatarUrl$ = this.organizationQuery.gravatarUrl$;
    this.collectionsService.updateCollectionFromName(organizationName, collectionName);
    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
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

  removeCollection(
    organization: Organization,
    collection: Collection
  ) {
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

  updateDescription(description: String, collectionId: number) {
    this.dialog.open(UpdateOrganizationOrCollectionDescriptionComponent, {
      data: { description: description, type: 'collection', collectionId: collectionId },
      width: '600px',
    });
  }
}
