import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';

@Injectable({
  providedIn: 'root',
})
export class GithubCallbackService {
  constructor(private router: Router) {}
  public resolveQueryParam(queryParams: Params | null): void {
    if (queryParams) {
      const state: string | null = queryParams.state;
      this.router.navigateByUrl(state);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
