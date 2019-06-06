import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenQuery } from './shared/state/token.query';
import { WorkflowQuery } from './shared/state/workflow.query';
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
  constructor(private tokenQuery: TokenQuery, private httpBackend: HttpBackend, private userQuery: UserQuery,
    private workflowQuery: WorkflowQuery) {}
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
    const entryType = this.workflowQuery.getSnapshot().entryType;
    let params = new HttpParams();
    params = params.set('state', entryType);
    params = params.set('suggested_target_id', id.toString());
    return 'https://github.com/apps/dockstore/installations/new/permissions?' + params.toString();
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
