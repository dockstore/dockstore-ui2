import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class UrlResolverService {

    constructor(private router: Router) { }

    public getEntryPathFromUrl(): string {
        const url = this.router.url;
        let title = this.decodedString(url.replace(`/my-workflows/`, ''));
        title = this.decodedString(title.replace(`/my-tools/`, ''));
        title = this.decodedString(title.replace(`/workflows/`, ''));
        title = this.decodedString(title.replace(`/tools/`, ''));
        title = this.decodedString(title.replace(`/containers/`, ''));

        // Get version from path if it exists
        const splitTitle = title.split(':');
        if (splitTitle.length === 2) {
            const urlVersion = splitTitle[1];
            title = title.replace(':' + urlVersion, '');
        }
        return title;
    }

    private isEncoded(uri: string): boolean {
        if (uri) {
            return uri !== decodeURIComponent(uri);
        }
        return null;
    }

    private decodedString(url: string): string {
        if (this.isEncoded(url)) {
            return decodeURIComponent(url);
        }
        return url;
    }
}
