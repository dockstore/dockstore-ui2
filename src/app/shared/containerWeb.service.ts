import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Dockstore } from './dockstore.model';
import { HttpService } from './http.service';

@Injectable()
export class ContainerWebService {
  constructor(private httpService: HttpService) { }

  public getContainer(containerId: number) {
      const url = `${ Dockstore.API_URI }/containers/${ containerId }`;
    return this.httpService.getAuthResponse(url);
  }
}
