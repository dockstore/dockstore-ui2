import { Component, OnInit } from '@angular/core';
import { TokenSource } from '../shared/enum/token-source.enum';
import { Profile } from '../shared/swagger';
import { UsersService } from '../shared/swagger/api/users.service';
import { UserService } from '../shared/user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  public user: any;
  TokenSource = TokenSource;
  googleProfile: Profile;
  gitHubProfile: Profile;
  constructor(private userService: UserService, private usersService: UsersService, private activatedRoute: ActivatedRoute) {}

  getUserInfo(username: string): void {
    this.usersService.listUser(username, 'userProfiles').subscribe(
      (User) => {
        this.user = User;
        if (User) {
          if (!this.user.avatarUrl) {
            this.user.avatarUrl = this.userService.gravatarUrl(null, null);
          }
          const userProfiles = User.userProfiles;
          if (userProfiles) {
            this.googleProfile = userProfiles[TokenSource.GOOGLE];
            // Using gravatar for Google also, may result in two identical pictures if both accounts use the same email address
            if (this.googleProfile && !this.googleProfile.avatarURL) {
              this.googleProfile.avatarURL = this.userService.gravatarUrl(this.googleProfile.email, this.googleProfile.avatarURL);
            }
            this.gitHubProfile = userProfiles[TokenSource.GITHUB];
            if (this.gitHubProfile && !this.gitHubProfile.avatarURL) {
              this.gitHubProfile.avatarURL = this.userService.gravatarUrl(this.gitHubProfile.email, this.gitHubProfile.avatarURL);
            }
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit(): void {
    const username = this.activatedRoute.snapshot.paramMap.get('username');
    this.getUserInfo(username);
  }
}
