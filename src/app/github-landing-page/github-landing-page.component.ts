import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Base } from 'app/shared/base';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryType as OpenApiEntryType, EntryTypeMetadata } from 'app/shared/openapi';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';

@Component({
  selector: 'app-github-landing-page',
  templateUrl: './github-landing-page.component.html',
  styleUrls: ['./github-landing-page.component.scss'],
})
export class GithubLandingPageComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  entryType: EntryType;
  entryTypeMetadata: EntryTypeMetadata;
  templateUrl: string;

  constructor(private activatedRoute: ActivatedRoute, private entryTypeMetadataService: EntryTypeMetadataService) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.entryType = params.entryType ? params.entryType : EntryType.BioWorkflow;
      this.entryTypeMetadata = this.entryTypeMetadataService.get(this.entryType.toUpperCase() as OpenApiEntryType);
      this.templateUrl = `${Dockstore.DOCUMENTATION_URL}/assets/templates/${this.entryType}s/${this.entryType}s.html`;
    });
  }
}
