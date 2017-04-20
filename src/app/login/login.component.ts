import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
import { TrackLoginService } from '../shared/track-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private trackLoginService: TrackLoginService,
              private authService: LoginService,
              private router: Router) { }

  private login(observable) {
    observable.subscribe(
      (response) => {
        this.trackLoginService.switchState(true);
        this.router.navigate(['/onboarding']);
      },
      (error) => {
        console.log('Authentication error: ' + error);
      }
    );
  }

  loginWithGitHub() {
    this.login(this.authService.authenticate('github'));
  }

  ngOnInit() {

  }

}
