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
      const url: string = this.stateToUrl(state);
      this.router.navigateByUrl(url);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Given the state query param, determines what route to go to
   *
   * @param {(string | null)} state  The state query param
   * @returns {(string)}  The route to redirect to
   * @memberof GithubCallbackComponent
   */
  public stateToUrl(state: string | null): string {
    if (state) {
      switch (state) {
        case EntryType.BioWorkflow:
          return '/my-workflows';
        case EntryType.Service:
          return '/my-services';
        case EntryType.Tool:
          return '/my-tools';
        default:
          return '/';
      }
    } else {
      return '/';
    }
  }
}
