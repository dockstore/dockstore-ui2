import { UsersService } from '../../shared/swagger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnInit {
  public curStep = 1;
  public tokenSetComplete;
  constructor(private userService: UserService, private usersService: UsersService) {
  }
  ngOnInit() {
    localStorage.setItem('page', '/onboarding');
    this.usersService.getUser().subscribe(
      user => {
        const tokenStatusSet =  this.userService.getUserTokenStatusSet(user.id);
        if (tokenStatusSet) {
          this.tokenSetComplete = tokenStatusSet.github;
        }
      }
    );
  }
  prevStep() {
    if (this.curStep > 1) {
      this.curStep--;
    }
  }
  nextStep() {
    if (this.tokenSetComplete) {
      return;
    }
    switch (this.curStep) {
      case 1:
      case 2:
        this.curStep++;
        break;
      default:
        localStorage.setItem('page', '/onboarding');
    }
  }

}
