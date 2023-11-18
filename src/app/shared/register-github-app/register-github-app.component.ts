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
  public gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
  public isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
  @Input() public entryType: string;

  constructor(private sessionQuery: SessionQuery, private userQuery: UserQuery) {}
}
