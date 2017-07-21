import { Configuration } from './../swagger/configuration';
import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import * as models from '../swagger/model/models';
import { WorkflowsService } from '../swagger/api/workflows.service';
import { Dockstore } from './../dockstore.model';
import { HttpService } from './../http.service';

@Injectable()
export class WorkflowWebService {
    constructor(
        protected http: Http,
        private configuration: Configuration, private httpService: HttpService, private workflowsService: WorkflowsService) {
        this.configuration.accessToken = this.httpService.getDockstoreToken();
        this.configuration.basePath = Dockstore.API_URI;
    }

    /**
    *
    * @method
    * @name refresh
    * @param {integer} workflowId - workflow ID
    *
    */
    public refresh(workflowId: number, extraHttpRequestParams?: any) {
        return this.workflowsService.refresh(workflowId, extraHttpRequestParams);
    }

    /**
     * Update the workflow versions linked to a workflow
     * Workflow version correspond to each row of the versions table listing all information for a workflow
     * @param workflowId Workflow to modify.
     * @param body List of modified workflow versions
     */
    public updateWorkflowVersion(workflowId: number, body: Array<models.WorkflowVersion>, extraHttpRequestParams?: any):
        Observable<Array<models.WorkflowVersion>> {
        return this.workflowsService.updateWorkflowVersion(workflowId, body, extraHttpRequestParams);
    }

    /**
     * Update the workflow with the given workflow.
     *
     * @param workflowId Workflow to modify.
     * @param body Workflow with updated information
     */
    public updateWorkflow(workflowId: number, body: models.Workflow, extraHttpRequestParams?: any): Observable<models.Workflow> {
        return this.workflowsService.updateWorkflow(workflowId, body, extraHttpRequestParams);
    }

    /**
     * Publish or unpublish a workflow
     * Publish/publish a workflow (public or private).
     * @param workflowId Tool id to publish/unpublish
     * @param body PublishRequest to refresh the list of repos for a user
     */
    public publish(workflowId: number, body: models.PublishRequest, extraHttpRequestParams?: any): Observable<models.Workflow> {
        return this.workflowsService.publish(workflowId, body, extraHttpRequestParams);
    }

    /**
   * Restub a workflow
   * Restubs a full, unpublished workflow.
   * @param workflowId workflow ID
   */
    public restub(workflowId: number, extraHttpRequestParams?: any): Observable<models.Workflow> {
        return this.workflowsService.restub(workflowId, extraHttpRequestParams);
    }

    /**
   * Delete test parameter files for a given version.
   *
   * @param workflowId Workflow to modify.
   * @param testParameterPaths List of paths.
   * @param version
   */
    public deleteTestParameterFiles(
        workflowId: number, testParameterPaths: Array<string>, version?: string, extraHttpRequestParams?: any):
        Observable<Array<models.SourceFile>> {
        return this.workflowsService.deleteTestParameterFiles(workflowId, testParameterPaths, version, extraHttpRequestParams);
    }

    /**
     * Add test parameter files for a given version.
     *
     * @param workflowId Workflow to modify.
     * @param testParameterPaths List of paths.
     * @param body This is here to appease Swagger. It requires PUT methods to have a body, even if it is empty. Please leave it empty.
     * @param version
     */
    public addTestParameterFiles(
        workflowId: number,
        testParameterPaths: Array<string>,
        body?: string, version?: string,
        extraHttpRequestParams?: any): Observable<Array<models.SourceFile>> {
        return this.workflowsService.addTestParameterFiles(workflowId, testParameterPaths, body, version, extraHttpRequestParams);
    }
}
