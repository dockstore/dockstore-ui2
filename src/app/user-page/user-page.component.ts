import { Component, OnInit } from '@angular/core';
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
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UserQuery } from '../shared/user/user.query';
import { Base } from '../shared/base';
import { AccountInfo } from '../loginComponents/accounts/external/accounts.component';
import { UrlResolverService } from '../shared/url-resolver.service';
import { RecentEventsComponent } from '../home-page/recent-events/recent-events.component';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLineModule } from '@angular/material/core';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FlexModule,
    ExtendedModule,
    MatIconModule,
    NgIf,
    MatLegacyCardModule,
    MatLineModule,
    MatBadgeModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    MatLegacyTabsModule,
    RecentEventsComponent,
    NgFor,
  ],
})
export class UserPageComponent extends Base implements OnInit {
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
    private userQuery: UserQuery,
    public urlResolverService: UrlResolverService
  ) {
    super();
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
        // Redirects to Page Not Found if user doesn't exist or another error occurs
        this.urlResolverService.showPageNotFound();
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
    this.activatedRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => this.getUserInfo(params['username']));
    this.userQuery.isAdminOrCurator$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isAdminOrCurator) => {
      this.loggedInUserIsAdminOrCurator = isAdminOrCurator;
    });
  }
}
