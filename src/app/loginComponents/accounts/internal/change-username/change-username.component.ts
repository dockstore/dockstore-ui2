import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../../loginComponents/user.service';
import { User } from '../../../../shared/swagger/model/user';
import { UsersService } from './../../../../shared/swagger/api/users.service';
import { RefreshService } from './../../../../shared/refresh.service';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.component.html',
  styleUrls: ['./change-username.component.scss']
})
export class ChangeUsernameComponent implements OnInit {
  @Input() showText;
  username: string;
  user: User;
  validUsername = true;
  checkingIfValid = false;
  usernameMeetsRequirements = true;
  extendedUser: any;
  constructor(private userService: UserService, private usersService: UsersService, private refreshService: RefreshService) { }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.username = user.username;
      }
    });
    this.userService.extendedUser$.subscribe(extendedUser => this.extendedUser = extendedUser);
  }

  /**
   * Returns true if the username exists, false otherwise
   */
  checkIfUsernameExists(event: any) {
    this.username = event.target.value;

    if (!this.isValidUsername()) {
      this.usernameMeetsRequirements = false;
    } else {
      this.checkingIfValid = true;
      this.usernameMeetsRequirements = true;
      this.usersService.checkUserExists(this.username).subscribe(
        (userExists: boolean) => {
          if (userExists && this.username === this.user.username) {
            this.validUsername = true;
          } else {
            this.validUsername = !userExists;
          }
          this.checkingIfValid = false;
        }, error => {
          this.checkingIfValid = false;
          console.error(error);
        });
    }
  }

  /**
   * Checks whether the currently typed username passes the requirements for a Dockstore username
   */
  isValidUsername() {
    const regex = /^[a-zA-Z][a-zA-Z0-9]*([-_]?[a-zA-Z0-9]+)*$/g;
    return this.username && this.username.trim() !== '' && !this.username.includes('@') && regex.test(this.username);
  }

  /**
   * Attempts to update the username to the new value given by the user
   */
  updateUsername() {
    this.usersService.changeUsername(this.username).subscribe(
      (user: User) => {
        this.userService.updateUser();
        this.refreshService.handleSuccess('Updating username');
      }, error => {
        console.error(error);
        this.refreshService.handleError('Updating username', error);
      });
  }

}
