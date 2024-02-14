import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../base';
import { Dockstore } from '../dockstore.model';
import { SessionQuery } from '../session/session.query';
import { UserQuery } from '../user/user.query';

@Component({
  selector: 'app-register-github-app',
  templateUrl: './register-github-app.component.html',
})
export class RegisterGithubAppComponent extends Base implements OnInit {
  public Dockstore = Dockstore;
  public gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLandingPageLink$;
  public isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
  @Input() public entryType: string;
  private gitHubAppInstallationLink: string;

  constructor(private sessionQuery: SessionQuery, private userQuery: UserQuery) {
    super();
  }

  ngOnInit(): void {
    this.gitHubAppInstallationLink$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((gitHubAppInstallationLink) => (this.gitHubAppInstallationLink = gitHubAppInstallationLink));
  }

  public openGitHubApp() {
    window.open(this.gitHubAppInstallationLink, '_blank', 'noopener,noreferrer');
  }
}
