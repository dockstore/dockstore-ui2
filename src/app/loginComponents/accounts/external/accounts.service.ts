import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { LoginService } from '../../../login/login.service';
import { TokenSource } from '../../../shared/enum/token-source.enum';
import { UserService } from '../../../shared/user/user.service';
import { Links } from './links.model';

@Injectable()
export class AccountsService {
  constructor(private loginService: LoginService, private userService: UserService) {}

  private stripSpace(url: string): string {
    return url.replace(/\s/g, '');
  }

  private openWindowPreserveSpaces(url: string): void {
    window.location.href = url;
  }

  private openWindow(url: string): void {
    window.location.href = this.stripSpace(url);
  }

  // Open a window for the user to login to the appropriate service
  link(source: string) {
    switch (source) {
      case TokenSource.GITHUB:
        this.openWindow(Links.GITHUB());
        break;
      case TokenSource.BITBUCKET:
        this.openWindow(Links.BITBUCKET());
        break;
      case TokenSource.GITLAB:
        this.openWindowPreserveSpaces(Links.GITLAB());
        break;
      case TokenSource.ZENODO:
        this.openWindowPreserveSpaces(Links.ZENODO());
        break;
      case TokenSource.QUAY:
        this.openWindow(Links.QUAY());
        break;
      case TokenSource.ORCID:
        this.openWindow(Links.ORCID());
        break;
      case TokenSource.GOOGLE:
        this.loginService
          .authenticate('google')
          .pipe(first())
          .subscribe(
            (response) => {
              // TODO: Hook up to snackbar
            },
            (error) => {
              // TODO: Hook up to snackbar
            },
            () => {
              // Also update user to get the new profile, which causes the token service to trigger and update the tokens too
              this.userService.getUser();
            }
          );
        break;
    }
  }
}
