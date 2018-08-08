import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../../loginComponents/user.service';
import { User } from '../../../../shared/swagger/model/user';
import { UsersService } from './../../../../shared/swagger/api/users.service';

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
  constructor(private userService: UserService, private usersService: UsersService) { }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.username = user.username;
      }
    });
  }

  /**
   * Returns true if the username exists, false otherwise
   */
  checkIfUsernameExists(event: any) {
    this.checkingIfValid = true;
    this.username = event.target.value;
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
