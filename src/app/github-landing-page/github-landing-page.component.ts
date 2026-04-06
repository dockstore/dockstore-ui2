import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Base } from 'app/shared/base';
import { EntryType, EntryTypeMetadata } from 'app/shared/openapi';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { CodeEditorComponent } from '../shared/code-editor/code-editor.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { RecommendedActionsComponent } from 'app/myworkflows/sidebar-accordion/github-apps-logs/recommended-actions.component';
import { GenerateDockstoreYmlButtonComponent } from './generate-dockstore-yml-button.component';

@Component({
  selector: 'app-github-landing-page',
  templateUrl: './github-landing-page.component.html',
  styleUrls: ['./github-landing-page.component.scss'],
  standalone: true,
  imports: [
    FlexModule,
    MatCardModule,
    MatDividerModule,
    CodeEditorComponent,
    RouterLink,
    RecommendedActionsComponent,
    GenerateDockstoreYmlButtonComponent,
  ],
})
export class GithubLandingPageComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  entryType: EntryType;
  entryTypeMetadata: EntryTypeMetadata;
  templateUrl: string;
  repository: string;

  constructor(private activatedRoute: ActivatedRoute, private entryTypeMetadataService: EntryTypeMetadataService) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.entryType = params.entryType ? params.entryType : EntryType.WORKFLOW;
      this.entryTypeMetadata = this.entryTypeMetadataService.get(this.entryType);
      this.templateUrl = `${Dockstore.DOCUMENTATION_URL}/assets/templates/${this.entryTypeMetadata.termPlural}/${this.entryTypeMetadata.termPlural}.html`;
    });
  }
}
