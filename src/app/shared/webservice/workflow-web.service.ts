import { PublishRequest } from './../models/PublishRequest';
import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models from '../model/models';
import { Dockstore } from './../dockstore.model';
import { HttpService } from './../http.service';

@Injectable()
export class WorkflowWebService {
    protected basePath = Dockstore.API_URI;
    public defaultHeaders: Headers = new Headers();
    constructor(protected http: Http, private httpService: HttpService) {
        this.defaultHeaders = this.httpService.getHeader(this.httpService.getDockstoreToken());
     }
    /**
    *
    * @method
    * @name manualRegister
    * @param {string} workflowRegistry - Workflow registry
    * @param {string} workflowPath - Workflow repository
    * @param {string} defaultWorkflowPath - Workflow container new descriptor path (CWL or WDL) and/or name
    * @param {string} workflowName - Workflow name
    * @param {string} descriptorType - Descriptor type
    *
    */
    public manualRegister(
        workflowRegistry: string,
        workflowPath: string,
        defaultWorkflowPath: string,
        workflowName: string,
        descriptorType: string) {
        const myParams = new URLSearchParams();
        if (workflowRegistry !== undefined) {
            myParams.set('workflowRegistry', workflowRegistry);
        }
        if (workflowPath !== undefined) {
            myParams.set('workflowPath', workflowPath);
        }
        if (defaultWorkflowPath !== undefined) {
            myParams.set('defaultWorkflowPath', defaultWorkflowPath);
        }
        if (workflowName !== undefined) {
            myParams.set('workflowName', workflowName);
        }
        if (descriptorType !== undefined) {
            myParams.set('descriptorType', descriptorType);
        }
        const uri = `/workflows/manualRegister`;
        return this.httpService.request(Dockstore.API_URI + uri, myParams, RequestMethod.Post, null);
    }

    /**
    *
    * @method
    * @name refresh
    * @param {integer} workflowId - workflow ID
    *
    */
    public refresh(workflowId: number) {
        const uri = `/workflows/${workflowId}/refresh`;
        const url = Dockstore.API_URI + uri;
        return this.httpService.getAuthResponse(url);
    }

    /**
       * Update the workflow with the given workflow.
       *
       * @param workflowId Workflow to modify.
       * @param body Workflow with updated information
       */
    public updateWorkflow(workflowId: number, body: models.Workflow, extraHttpRequestParams?: any): Observable<models.Workflow> {
        return this.updateWorkflowWithHttpInfo(workflowId, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
   * Update the workflow with the given workflow.
   *
   * @param workflowId Workflow to modify.
   * @param body Workflow with updated information
   */
    public updateWorkflowWithHttpInfo(workflowId: number, body: models.Workflow, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/workflows/${workflowId}`;

        const queryParameters = new URLSearchParams();
        const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'workflowId' is not null or undefined
        if (workflowId === null || workflowId === undefined) {
            throw new Error('Required parameter workflowId was null or undefined when calling updateWorkflow.');
        }
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateWorkflow.');
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
	* @param {integer} workflowId - Tool id to publish/unpublish
	* @param {PublishRequest} body - PublishRequest to refresh the list of repos for a user
	*
	*/
    public publish(workflowId: number, body: PublishRequest) {
        const uri = `/workflows/${workflowId}/publish`;
        const url = Dockstore.API_URI + uri;
        return this.httpService.postResponse(url, JSON.stringify(body));
    }
}
