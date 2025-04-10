import { Component, Input, OnInit } from '@angular/core';
import { Base } from '../base';
import { Dockstore } from '../dockstore.model';
import { UserQuery } from '../user/user.query';
import { HttpParams } from '@angular/common/http';
import { EntryType, EntryTypeMetadata } from '../openapi';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-github-app',
  templateUrl: './register-github-app.component.html',
  standalone: true,
  imports: [MatIconModule, FlexModule, MatButtonModule, MatTooltipModule, AsyncPipe, TitleCasePipe],
})
export class RegisterGithubAppComponent extends Base implements OnInit {
  public Dockstore = Dockstore;
  public isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
  public entryTypeMetadata: EntryTypeMetadata;
  @Input() public entryType: EntryType;
  private gitHubAppInstallationLink: string;

  constructor(private userQuery: UserQuery, private entryTypeMetadataService: EntryTypeMetadataService) {
    super();
  }

  ngOnInit(): void {
    this.gitHubAppInstallationLink = this.generateGitHubAppInstallationUrl(this.entryType);
    this.entryTypeMetadata = this.entryTypeMetadataService.get(this.entryType);
  }

  public openGitHubApp() {
    window.open(this.gitHubAppInstallationLink, '_blank', 'noopener,noreferrer');
  }

  /**
   * Generates a GitHub App installation URL that has a 'state' query parameter containing an entryType.
   *
   * The GitHub App installation link allows a 'state' query parameter that preserves the state of the application page
   * and return users back to that state after they install the GitHub App.
   * More details here https://docs.github.com/en/apps/sharing-github-apps/sharing-your-github-app.
   *
   * The entryType is used as the 'state' so that users are redirected to the GitHub App landing page for the entryType they were registering.
   *
   * @param entryType Entry type to use as the 'state' query parameter in the installation URL
   * @returns
   */
  generateGitHubAppInstallationUrl(entryType: EntryType): string {
    let queryParams = new HttpParams();
    // Can only provide a state query parameter
    // https://docs.github.com/en/apps/sharing-github-apps/sharing-your-github-app
    queryParams = queryParams.set('state', entryType);
    return Dockstore.GITHUB_APP_INSTALLATION_URL + '/installations/new?' + queryParams.toString();
  }
}
