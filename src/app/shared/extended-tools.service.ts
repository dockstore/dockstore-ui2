import { ContainersService } from './../shared/swagger/api/containers.service';
import { Observable } from 'rxjs';
import { HttpResponse, HttpEvent } from '@angular/common/http';

/**
 * This is an extension of the generated swagger code. The reason it exists is that for zip download to work,
 *  httpClient needs to set responseType to blob, which cannot be done with swagger codegen.
 *
 * @export
 * @class ExtendedToolsService
 * @extends {ContainersService}
 */
/* tslint:disable */
export class ExtendedToolsService extends ContainersService {
  /**
   * Download a ZIP file of a tool and all associated files.
   *
   * @param toolId toolId
   * @param tagId tagId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getToolZip(toolId: number, tagId: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public getToolZip(toolId: number, tagId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public getToolZip(toolId: number, tagId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public getToolZip(toolId: number, tagId: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (toolId === null || toolId === undefined) {
      throw new Error('Required parameter toolId was null or undefined when calling getToolZip.');
    }
    if (tagId === null || tagId === undefined) {
      throw new Error('Required parameter tagId was null or undefined when calling getToolZip.');
    }

    let headers = this.defaultHeaders;

    // authentication (BEARER) required
    if (this.configuration.apiKeys['Authorization']) {
      headers = headers.set('Authorization', this.configuration.apiKeys['Authorization']);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/zip'];
    let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.get<any>(
      `${this.configuration.basePath}/containers/${encodeURIComponent(String(toolId))}/zip/${encodeURIComponent(String(tagId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
        responseType: 'blob' as 'json'
      }
    );
  }
}
