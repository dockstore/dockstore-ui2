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

  public getDockerRegistryList() {
    const url = `${ Dockstore.API_URI }/containers/dockerRegistryList`;
    return this.httpService.getResponse(url);
  }

  public postRegisterManual(toolObj) {
    const url = `${ Dockstore.API_URI }/containers/registerManual`;
    return this.httpService.postResponse(url, JSON.stringify(toolObj));
  }

  public getContainerRefresh(toolId: number) {
    const url = `${ Dockstore.API_URI }/containers/${ toolId }/refresh`;
    return this.httpService.getAuthResponse(url);
  }
}
