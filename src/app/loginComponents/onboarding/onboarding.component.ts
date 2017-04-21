import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnInit {

  ngOnInit() {
    localStorage.setItem('page', '/onboarding');
  }

}
