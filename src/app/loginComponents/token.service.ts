import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';

@Injectable()
export class TokenService {

  constructor(private dockstoreService: DockstoreService) { }

  private getUserTokens(id: number) {
    const userTokensUrl = Dockstore.API_URI + '/users/' + id + '/tokens';
    return this.dockstoreService.getResponse(userTokensUrl);
  }

  getUserSetTokens(id: number) {

  }
}
