import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkflowsService } from './../shared/swagger/api/workflows.service';

/**
 * This is an extension of the generated swagger code. The reason it exists is that for zip download to work,
 *  httpClient needs to set responseType to blob, which cannot be done with swagger codegen.
 *
 * @export
 * @class ExtendedWorkflowsService
 * @extends {WorkflowsService}
 */
/* tslint:disable */
export class ExtendedWorkflowsService extends WorkflowsService {
  /**
   * Download a ZIP file of a workflow and all associated files.
   *
   * @param workflowId workflowId
   * @param workflowVersionId workflowVersionId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getWorkflowZip(workflowId: number, workflowVersionId: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public getWorkflowZip(
    workflowId: number,
    workflowVersionId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public getWorkflowZip(
    workflowId: number,
    workflowVersionId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public getWorkflowZip(
    workflowId: number,
    workflowVersionId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (workflowId === null || workflowId === undefined) {
      throw new Error('Required parameter workflowId was null or undefined when calling getWorkflowZip.');
    }
    if (workflowVersionId === null || workflowVersionId === undefined) {
      throw new Error('Required parameter workflowVersionId was null or undefined when calling getWorkflowZip.');
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

    return this.httpClient.get<any>(
      `${this.configuration.basePath}/workflows/${encodeURIComponent(String(workflowId))}/zip/${encodeURIComponent(
        String(workflowVersionId)
      )}`,
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
