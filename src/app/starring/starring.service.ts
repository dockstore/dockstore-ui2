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
    console.log('setUnstar');
    const url = `${ Dockstore.API_URI }/${ entryType }/${ entryID }/unstar`;
    return this.httpService.delete(url);
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
    return this.httpService.getAuthResponse(url);
  }

  getStarredTools(): any {
    const url = `${ Dockstore.API_URI }/users/starredTools/`;
    return this.httpService.getAuthResponse(url);
  }

  getStarredWorkflows(): any {
    const url = `${ Dockstore.API_URI }/users/starredWorkflows/`;
    return this.httpService.getAuthResponse(url);
  }
}
