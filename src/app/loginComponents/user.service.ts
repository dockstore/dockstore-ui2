import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';

@Injectable()
export class UserService {

  constructor(private httpService: HttpService) { }

  getUser() {
    const getUserUrl = `${ Dockstore.API_URI }/users/user`;
    return this.httpService.getAuthResponse(getUserUrl);
  }

  getTokens(userId: number) {
    const getUserTokensUrl = `${ Dockstore.API_URI }/users/${ userId }/tokens`;
    return this.httpService.getAuthResponse(getUserTokensUrl);
  }

}
