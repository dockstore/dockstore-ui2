import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenSource } from '../shared/enum/token-source.enum';
import { Profile, TokenUser, User } from '../shared/openapi';
import { UsersService } from '../shared/openapi/api/users.service';
import { UserService } from '../shared/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../shared/alert/state/alert.service';
import { GithubAppsLogsComponent } from '../myworkflows/sidebar-accordion/github-apps-logs/github-apps-logs.component';
import { accountInfo, bootstrap4extraLargeModalSize } from '../shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { UserQuery } from '../shared/user/user.query';
import { Base } from '../shared/base';
import { AccountInfo } from '../loginComponents/accounts/external/accounts.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent extends Base implements OnInit, OnDestroy {
  public user: User;
  public TokenSource = TokenSource;
  public googleProfile: Profile;
  public gitHubProfile: Profile;
  public loggedInUserIsAdminOrCurator: boolean;
  protected otherLinkedAccountsInfo: AccountInfo[] = [];
  accountsInfo: Array<AccountInfo> = accountInfo;
  //these type of accounts are visible to everyone on their userpage
  private publicAccountsSource: TokenSource[] = [TokenSource.GITHUB, TokenSource.GOOGLE, TokenSource.ORCID];

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private userQuery: UserQuery
  ) {
    super();
  }

  handleNewUser(username: string): void {
    this.getUserInfo(username);
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
          this.getOtherLinkedAccounts();
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.router.navigateByUrl('/page-not-found'); //redirects to Page Not Found if user doesn't exist or another error occurs;
      }
    );
  }

  openGitHubAppsLogs(userId: number) {
    this.dialog.open(GithubAppsLogsComponent, { width: bootstrap4extraLargeModalSize, data: { userId: userId } });
  }

  getOtherLinkedAccounts() {
    this.otherLinkedAccountsInfo = [];
    this.usersService
      .getUserTokens(this.user.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tokens: TokenUser[]) => {
        for (const account of this.accountsInfo) {
          const found = tokens.find((token) => token.tokenSource === account.source);
          if (found && !this.publicAccountsSource.includes(account.source)) {
            this.otherLinkedAccountsInfo.push(Object.assign({ username: found.username }, account));
          }
        }
      });
  }
  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => this.handleNewUser(params['username']));
    this.userQuery.isAdminOrCurator$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isAdminOrCurator) => {
      this.loggedInUserIsAdminOrCurator = isAdminOrCurator;
    });
  }
}
