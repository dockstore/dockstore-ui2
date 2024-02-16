import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { EntryType } from 'app/shared/openapi';

@Injectable({
  providedIn: 'root',
})
export class GithubCallbackService {
  constructor(private router: Router) {}
  public resolveQueryParam(queryParams: Params | null): void {
    if (queryParams) {
      const entryTypeValue: EntryType | null = queryParams.state;
      this.router.navigate(['/github-landing-page'], { queryParams: { entryType: entryTypeValue } });
    } else {
      this.router.navigateByUrl('/github-landing-page');
    }
  }
}
