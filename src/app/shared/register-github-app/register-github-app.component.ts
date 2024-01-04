import { Component, Input } from '@angular/core';
import { Dockstore } from '../dockstore.model';
import { SessionQuery } from '../session/session.query';
import { UserQuery } from '../user/user.query';

@Component({
  selector: 'app-register-github-app',
  templateUrl: './register-github-app.component.html',
})
export class RegisterGithubAppComponent {
  public Dockstore = Dockstore;
  public gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLandingPageLink$;
  public isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
  @Input() public entryType: string;

  constructor(private sessionQuery: SessionQuery, private userQuery: UserQuery) {}

  public registerGitHubApp(observable) {
    observable.subscribe(
      (response) => {
        window.open(response, '_blank', 'noopener,noreferrer');
      },
      (error) => {
        console.log('GitHub Apps registration error: ' + error);
      }
    );
  }
}
