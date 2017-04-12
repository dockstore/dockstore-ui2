import { Component, OnInit } from '@angular/core';

import { AuthService } from 'ng2-ui-auth';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService,
              private localStorageService: LocalStorageService) { }

  loginWithGoogle() {
    this.auth.authenticate('github')
      .subscribe(
        (response) => {
          const tokenObj = response.json();
          this.localStorageService.set('dockstoreToken', tokenObj);
        },
        (err) => {
          console.log('Authentication error: ' + err);
        }
      );
  }

  ngOnInit() {

  }

}
