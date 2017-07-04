
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Dockstore } from './../dockstore.model';
import { HttpService } from './../http.service';
import { PublishRequest } from './../models/PublishRequest';

@Injectable()
export class ContainerWebService {
  domain: string;
  constructor(private httpService: HttpService) {
    this.domain = Dockstore.API_URI;
  }

  public getContainer(containerId: number) {
    const url = `${Dockstore.API_URI}/containers/${containerId}`;
    return this.httpService.getAuthResponse(url);
  }

  public getDockerRegistryList() {
    const url = `${Dockstore.API_URI}/containers/dockerRegistryList`;
    return this.httpService.getResponse(url);
  }

  public postRegisterManual(toolObj) {
    const url = `${Dockstore.API_URI}/containers/registerManual`;
    return this.httpService.postResponse(url, JSON.stringify(toolObj));
  }

  public getContainerRefresh(toolId: number) {
    const url = `${Dockstore.API_URI}/containers/${toolId}/refresh`;
    return this.httpService.getAuthResponse(url);
  }

  /**
   *
   * @method
   * @name publish
   * @param {integer} containerId - Tool id to publish
   * @param {PublishRequest} body - PublishRequest to refresh the list of repos for a user
   *
   */
  public publish(containerId: number, body: PublishRequest) {
    const uri = `/containers/${containerId}/publish`;
    const url = this.domain + uri;
    return this.httpService.postResponse(url, JSON.stringify(body));
  }

  /**
  *
	* @method
	* @name deleteContainer
	* @param {integer} containerId - Tool id to delete
	*
	*/
  public deleteContainer(containerId: number) {
    const uri = `/containers/${containerId}`;
    const url = this.domain + uri;
    return this.httpService.deleteAuth(url);
  }
}
