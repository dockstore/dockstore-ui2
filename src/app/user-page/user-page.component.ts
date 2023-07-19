import { Component, OnInit } from '@angular/core';
import { TokenSource } from '../shared/enum/token-source.enum';
import { Profile } from '../shared/openapi';
import { UsersService } from '../shared/openapi/api/users.service';
import { UserService } from '../shared/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../shared/alert/state/alert.service';
import { GithubAppsLogsComponent } from '../myworkflows/sidebar-accordion/github-apps-logs/github-apps-logs.component';
import { bootstrap4largeModalSize } from '../shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { UserQuery } from '../shared/user/user.query';
import { Base } from '../shared/base';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent extends Base implements OnInit {
  public user: any;
  public username: string;
  public TokenSource = TokenSource;
  public googleProfile: Profile;
  public gitHubProfile: Profile;
  public loggedInUserIsAdminOrCurator: boolean;
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private usersService: UsersService,
    private userQuery: UserQuery,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    super();
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    this.userQuery.isAdminOrCurator$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isAdminOrCurator) => {
      this.loggedInUserIsAdminOrCurator = isAdminOrCurator;
    });
  }

  getUserInfo(username: string): void {
    this.usersService.listUser(username, 'userProfiles').subscribe(
      (user) => {
        this.user = user;
        if (user) {
          if (!this.user.avatarUrl) {
            this.user.avatarUrl = this.userService.gravatarUrl(null);
          }
          const userProfiles = user.userProfiles;
          if (userProfiles) {
            this.googleProfile = userProfiles[TokenSource.GOOGLE];
            // Using gravatar for Google also, may result in two identical pictures if both accounts use the same email address
            if (this.googleProfile && !this.googleProfile.avatarURL) {
              this.googleProfile.avatarURL = this.userService.gravatarUrl(this.googleProfile.avatarURL);
            }
            this.gitHubProfile = userProfiles[TokenSource.GITHUB];
            if (this.gitHubProfile && !this.gitHubProfile.avatarURL) {
              this.gitHubProfile.avatarURL = this.userService.gravatarUrl(this.gitHubProfile.avatarURL);
            }
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.router.navigateByUrl('/page-not-found'); //redirects to Page Not Found if user doesn't exist or another error occurs;
      }
    );
  }

  openGitHubAppsLogs(userId: number) {
    this.dialog.open(GithubAppsLogsComponent, { width: bootstrap4largeModalSize, data: { userId: userId } });
  }

  ngOnInit(): void {
    this.getUserInfo(this.username);
  }
}
