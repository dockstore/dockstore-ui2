import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenQuery } from './shared/state/token.query';
import { UserQuery } from './shared/user/user.query';

/**
 * This converts an organization name or username to a GitHub apps installation link
 * Works for a user's name and a GitHub organization returned by the /user/orgs GitHub endpoint
 *
 * @export
 * @class GithubNameToIdPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'githubNameToId'
})
export class GithubNameToIdPipe implements PipeTransform {
  constructor(private tokenQuery: TokenQuery, private httpBackend: HttpBackend, private userQuery: UserQuery) {}
  transform(userNameOrOrganizationName: string): Observable<string> {
    const username = this.userQuery.getSnapshot().user.name;
    if (userNameOrOrganizationName === username) {
      return this.getIdFromUsername(username);
    }
    return this.tokenQuery.gitHubOrganizations$.pipe(
      map((organizationsResponse: Array<any>) => {
        if (!organizationsResponse) {
          return null;
        }
        const matchingOrganization = organizationsResponse.find(e => e.login === userNameOrOrganizationName);
        if (matchingOrganization) {
          return this.idToLink(matchingOrganization['id']);
        } else {
          return null;
        }
      })
    );
  }

  private idToLink(id: number): string {
    return 'https://github.com/apps/dockstore/installations/new/permissions?state=my-services&suggested_target_id=' + id;
  }

  private getIdFromUsername(username: string): Observable<string> {
    const token = this.tokenQuery.getEntity('github.com');
    const httpClient = new HttpClient(this.httpBackend);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'token ' + token.token
      })
    };
    const url = 'https://api.github.com/users/' + username;
    return httpClient.get(url, httpOptions).pipe(
      map(response => {
        return this.idToLink(response['id']);
      })
    );
  }
}
