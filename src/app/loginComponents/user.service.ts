import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';

@Injectable()
export class UserService {

  private userSource = new Subject<any>();

  user$ = this.userSource.asObservable();

  constructor(private httpService: HttpService) { }

  setUser(user) {
    this.userSource.next(user);
  }

  updateUser() {
    const updateUserUrl = `${ Dockstore.API_URI }/users/user/updateUserMetadata`;
    return this.httpService.getAuthResponse(updateUserUrl);
  }

  getUser() {
    const getUserUrl = `${ Dockstore.API_URI }/users/user`;
    return this.httpService.getAuthResponse(getUserUrl);
  }

  getTokens(userId: number) {
    const getUserTokensUrl = `${ Dockstore.API_URI }/users/${ userId }/tokens`;
    return this.httpService.getAuthResponse(getUserTokensUrl);
  }

  getUserTools(userId: number) {
    const getUserToolsUrl = `${ Dockstore.API_URI }/users/${ userId }/containers`;
    return this.httpService.getAuthResponse(getUserToolsUrl);
  }

  getUserWorkflowList(userId: number) {
    const getUserWorkflowUrl = `${ Dockstore.API_URI }/users/${ userId }/workflows`;
    return this.httpService.getAuthResponse(getUserWorkflowUrl);
  }

}
