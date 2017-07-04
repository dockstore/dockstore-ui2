import { Injectable } from '@angular/core';
import { RequestMethod, URLSearchParams} from '@angular/http';
import { AuthService } from 'ng2-ui-auth';
import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';

@Injectable()
export class StarringService {
  constructor(private httpService: HttpService,
              private authService: AuthService) { }
  setUnstar(entryID: number, entryType: string): any {
    const url = `${ Dockstore.API_URI }/${ entryType }/${ entryID }/unstar`;
    return this.httpService.requestNoParams(url, RequestMethod.Delete, this.authService.getToken());
  }
  setStar(entryID: number, entryType: string): any {
    const url = `${ Dockstore.API_URI }/${ entryType }/${ entryID }/star`;
    const body = {
      containerId: entryID,
      workflowId: entryID
    };
    return this.httpService.putResponse(url, body, this.authService.getToken());
  }
  getStarring(entryID: number, entryType: string): any {
    const url = `${ Dockstore.API_URI }/${ entryType }/${ entryID }/starredUsers`;
    return this.httpService.requestNoParams(url, RequestMethod.Get, this.authService.getToken());
  }

  getStarredTools(): any {
    const url = `${ Dockstore.API_URI }/users/starredTools/`;
    return this.httpService.requestNoParams(url, RequestMethod.Get, this.authService.getToken());
  }

  getStarredWorkflows(): any {
    const url = `${ Dockstore.API_URI }/users/starredWorkflows/`;
    return this.httpService.requestNoParams(url, RequestMethod.Get, this.authService.getToken());
  }
}
