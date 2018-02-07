import { Links } from './links.model';
import { TokenSource } from './../../../shared/enum/token-source.enum';
import { Injectable } from '@angular/core';

@Injectable()
export class AccountsService {

    constructor() { }

    private stripSpace(url: string): string {
        return url.replace(/\s/g, '');
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
                this.openWindow(Links.GITLAB);
                break;
            case TokenSource.QUAY:
                this.openWindow(Links.QUAY);
                break;
        }
    }
}
