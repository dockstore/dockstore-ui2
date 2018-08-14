import { TokenService } from '../token.service';
import { UsersService } from '../../shared/swagger';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnInit {
  public tokenSetComplete;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  extendedUser: any;
  constructor(private userService: UserService, private usersService: UsersService, private tokenService: TokenService) {
  }
  ngOnInit() {
    localStorage.setItem('page', '/onboarding');
    this.tokenService.tokens$.subscribe(
      tokens => {
        if (tokens) {
          const tokenStatusSet = this.tokenService.getUserTokenStatusSet(tokens);
          if (tokenStatusSet) {
            this.tokenSetComplete = tokenStatusSet.github;
          }
        }
      }
    );

    this.userService.extendedUser$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(extendedUser => this.extendedUser = extendedUser);
  }
}
