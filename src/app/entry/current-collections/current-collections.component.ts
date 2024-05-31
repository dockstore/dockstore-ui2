import { Component, Input, OnChanges, OnInit, SimpleChanges, Version } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AddEntryComponent } from '../../organizations/collection/add-entry/add-entry.component';
import { CollectionOrganization, Tag, WorkflowVersion } from '../../shared/openapi';
import { TrackLoginService } from '../../shared/track-login.service';
import { CurrentCollectionsQuery } from '../state/current-collections.query';
import { CurrentCollectionsService } from '../state/current-collections.service';
import { OrgLogoService } from '../../shared/org-logo.service';
import { GravatarPipe } from '../../gravatar/gravatar.pipe';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { MatDividerModule } from '@angular/material/divider';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-current-collections',
  templateUrl: './current-collections.component.html',
  styleUrls: ['./current-collections.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyCardModule,
    FlexModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    ExtendedModule,
    MatDividerModule,
    NgFor,
    ImgFallbackDirective,
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    GravatarPipe,
  ],
})
export class CurrentCollectionsComponent implements OnInit, OnChanges {
  @Input() id: number;
  // This is bad, should not have an input that's only passed down the chain
  @Input() versions: WorkflowVersion[] | Tag[];
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
