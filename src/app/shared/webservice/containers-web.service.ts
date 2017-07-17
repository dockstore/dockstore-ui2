import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Dockstore } from './../dockstore.model';
import { HttpService } from './../http.service';
import { PublishRequest } from './../models/PublishRequest';
import * as models from '../model/models';

@Injectable()
export class ContainersWebService {
  protected basePath = Dockstore.API_URI;
  public defaultHeaders: Headers = new Headers();
  constructor(protected http: Http, private httpService: HttpService) {
    this.defaultHeaders = this.httpService.getHeader(this.httpService.getDockstoreToken());
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
   * Update the tool with the given tool.
   *
   * @param containerId Tool to modify.
   * @param body Tool with updated information
   */
  public updateContainer(containerId: number,
    body: models.DockstoreTool, extraHttpRequestParams?: any): Observable<models.DockstoreTool> {
    return this.updateContainerWithHttpInfo(containerId, body, extraHttpRequestParams)
      .map((response: Response) => {
        if (response.status === 204) {
          return undefined;
        } else {
          return response.json();
        }
      });
  }

  /**
   * Update the tool with the given tool.
   *
   * @param containerId Tool to modify.
   * @param body Tool with updated information
   */
  public updateContainerWithHttpInfo(containerId: number,
    body: models.DockstoreTool, extraHttpRequestParams?: any): Observable<Response> {
    const path = this.basePath + `/containers/${containerId}`;

    const queryParameters = new URLSearchParams();
    const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
    // verify required parameter 'containerId' is not null or undefined
    if (containerId === null || containerId === undefined) {
      throw new Error('Required parameter containerId was null or undefined when calling updateContainer.');
    }
    // verify required parameter 'body' is not null or undefined
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling updateContainer.');
    }
    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json'
    ];

    // to determine the Accept header
    const produces: string[] = [
      'application/json'
    ];

    headers.set('Content-Type', 'application/json');

    let requestOptions: RequestOptionsArgs = new RequestOptions({
      method: RequestMethod.Put,
      headers: headers,
      body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
      search: queryParameters
    });

    // https://github.com/swagger-api/swagger-codegen/issues/4037
    if (extraHttpRequestParams) {
      requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
    }

    return this.http.request(path, requestOptions);
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
    const url = this.basePath + uri;
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
    const url = this.basePath + uri;
    return this.httpService.deleteAuth(url);
  }
}
