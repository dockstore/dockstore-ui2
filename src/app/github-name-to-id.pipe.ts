import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { HashMap } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenQuery } from './shared/state/token.query';
import { Token } from './shared/swagger';

@Pipe({
  name: 'githubNameToId'
})
export class GithubNameToIdPipe implements PipeTransform {
  private httpClient: HttpClient;
  constructor(private httpBackend: HttpBackend, private tokenQuery: TokenQuery) { }
  transform(userNameOrOrganizationName): Observable<string> {
    const entities: HashMap<Token> = this.tokenQuery.getSnapshot().entities;
    const thing: Token = entities['github.com'];
    this.httpClient = new HttpClient(this.httpBackend);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'token ' + thing.token
      })
    };
    const url = 'https://api.github.com/users/' + userNameOrOrganizationName;
    return this.httpClient.get(url, httpOptions).pipe(map((response) => {
      return this.idToLink(response['id']);
    }));
  }

  private idToLink(id: number): string {
    return 'https://github.com/apps/dockstore/installations/new/permissions?suggested_target_id=' + id;

  }

}
