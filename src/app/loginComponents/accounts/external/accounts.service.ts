import {first} from 'rxjs/operators';
import {Links} from './links.model';
import {TokenSource} from './../../../shared/enum/token-source.enum';
import {Injectable} from '@angular/core';
import {LoginService} from '../../../login/login.service';
import {TokenService} from '../../token.service';

@Injectable()
export class AccountsService {

    constructor(private loginService: LoginService, private tokenService: TokenService) { }

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
                this.openWindow(Links.GITHUB);
                break;
            case TokenSource.BITBUCKET:
                this.openWindow(Links.BITBUCKET);
                break;
            case TokenSource.GITLAB:
                this.openWindowPreserveSpaces(Links.GITLAB);
                break;
            case TokenSource.QUAY:
                this.openWindow(Links.QUAY);
                break;
            case TokenSource.GOOGLE:
                this.loginService.authenticate('google').pipe(first()).subscribe(response => {
                  // TODO: Hook up to snackbar
                }, error => {
                  // TODO: Hook up to snackbar
                }, () => {
                  // Always refresh tokens
                  this.tokenService.updateTokens();
                });
                break;
        }
    }
}
