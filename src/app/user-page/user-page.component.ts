import { Component, OnInit } from '@angular/core';
import { TokenSource } from '../shared/enum/token-source.enum';
import { Profile } from '../shared/swagger';
import { UsersService } from '../shared/swagger/api/users.service';
import { UserService } from '../shared/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../shared/alert/state/alert.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  public user: any;
  public username: string;
  public TokenSource = TokenSource;
  public googleProfile: Profile;
  public gitHubProfile: Profile;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  constructor(
    private userService: UserService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    this.checkIfUsernameExists(this.username);
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
      }
    );
  }

  /**
   * Checks if username exists, if not, navigates to homepage
   */
  checkIfUsernameExists(value: string): void {
    const username = value;
    this.usersService
      .checkUserExists(username)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (userExists: boolean) => {
          if (!userExists) {
            this.router.navigateByUrl('');
          }
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  ngOnInit(): void {
    this.getUserInfo(this.username);
  }
}
