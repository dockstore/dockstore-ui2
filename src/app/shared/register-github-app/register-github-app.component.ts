import { Component, Input } from '@angular/core';
import { Dockstore } from '../dockstore.model';
import { SessionQuery } from '../session/session.query';
import { UserQuery } from '../user/user.query';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { RegisterGithubAppModalComponent } from '../../workflow/register-workflow-modal/register-github-app-modal/register-github-app-modal.component';

@Component({
  selector: 'app-register-github-app',
  templateUrl: './register-github-app.component.html',
})
export class RegisterGithubAppComponent {
  public Dockstore = Dockstore;
  public gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLandingPageLink$;
  public isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
  @Input() public entryType: string;

  constructor(
    private sessionQuery: SessionQuery,
    private userQuery: UserQuery,
    private router: Router,
    public parentDialogRef: MatDialogRef<RegisterGithubAppModalComponent>
  ) {}

  public registerGitHubApp(observable) {
    observable.subscribe(
      (response) => {
        window.open(response, '_blank', 'noopener, noreferrer');
      },
      (error) => {
        console.log('GitHub Apps registration error: ' + error);
      }
    );
    this.parentDialogRef.close();
    this.router.navigate(['/github-landing-page']);
  }
}
