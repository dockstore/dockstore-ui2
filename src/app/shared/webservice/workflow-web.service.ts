import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { PublishRequest } from './../swagger/model/PublishRequest';
import * as models from '../swagger/model/models';
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
     * Update the workflow versions linked to a workflow
     * Workflow version correspond to each row of the versions table listing all information for a workflow
     * @param workflowId Workflow to modify.
     * @param body List of modified workflow versions
     */
    public updateWorkflowVersion(workflowId: number, body: Array<models.WorkflowVersion>, extraHttpRequestParams?: any):
        Observable<Array<models.WorkflowVersion>> {
        return this.updateWorkflowVersionWithHttpInfo(workflowId, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * Update the workflow versions linked to a workflow
     * Workflow version correspond to each row of the versions table listing all information for a workflow
     * @param workflowId Workflow to modify.
     * @param body List of modified workflow versions
     */
    public updateWorkflowVersionWithHttpInfo(
        workflowId: number, body: Array<models.WorkflowVersion>, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/workflows/${workflowId}/workflowVersions`;

        const queryParameters = new URLSearchParams();
        const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'workflowId' is not null or undefined
        if (workflowId === null || workflowId === undefined) {
            throw new Error('Required parameter workflowId was null or undefined when calling updateWorkflowVersion.');
        }
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateWorkflowVersion.');
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
     * Publish or unpublish a workflow
     * Publish/publish a workflow (public or private).
     * @param workflowId Tool id to publish/unpublish
     * @param body PublishRequest to refresh the list of repos for a user
     */
    public publish(workflowId: number, body: models.PublishRequest, extraHttpRequestParams?: any): Observable<models.Workflow> {
        return this.publishWithHttpInfo(workflowId, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * Publish or unpublish a workflow
     * Publish/publish a workflow (public or private).
     * @param workflowId Tool id to publish/unpublish
     * @param body PublishRequest to refresh the list of repos for a user
     */
    public publishWithHttpInfo(workflowId: number, body: models.PublishRequest, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/workflows/${workflowId}/publish`;

        const queryParameters = new URLSearchParams();
        const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'workflowId' is not null or undefined
        if (workflowId === null || workflowId === undefined) {
            throw new Error('Required parameter workflowId was null or undefined when calling publish.');
        }
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling publish.');
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
            method: RequestMethod.Post,
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
   * Restub a workflow
   * Restubs a full, unpublished workflow.
   * @param workflowId workflow ID
   */
    public restub(workflowId: number, extraHttpRequestParams?: any): Observable<models.Workflow> {
        return this.restubWithHttpInfo(workflowId, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
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
        console.log(version);
        return this.deleteTestParameterFilesWithHttpInfo(workflowId, testParameterPaths, version, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
    * Delete test parameter files for a given version.
    *
    * @param workflowId Workflow to modify.
    * @param testParameterPaths List of paths.
    * @param version
    */
    public deleteTestParameterFilesWithHttpInfo(
        workflowId: number, testParameterPaths: Array<string>, version?: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/workflows/${workflowId}/testParameterFiles`;

        const queryParameters = new URLSearchParams();
        const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'workflowId' is not null or undefined
        if (workflowId === null || workflowId === undefined) {
            throw new Error('Required parameter workflowId was null or undefined when calling deleteTestParameterFiles.');
        }
        // verify required parameter 'testParameterPaths' is not null or undefined
        if (testParameterPaths === null || testParameterPaths === undefined) {
            throw new Error('Required parameter testParameterPaths was null or undefined when calling deleteTestParameterFiles.');
        }
        if (testParameterPaths) {
            testParameterPaths.forEach((element) => {
                queryParameters.append('testParameterPaths', <any>element);
            });
        }

        if (version !== undefined) {
            queryParameters.set('version', <any>version);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        const produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Delete,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
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
        return this.addTestParameterFilesWithHttpInfo(workflowId, testParameterPaths, body, version, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
 * Add test parameter files for a given version.
 *
 * @param workflowId Workflow to modify.
 * @param testParameterPaths List of paths.
 * @param body This is here to appease Swagger. It requires PUT methods to have a body, even if it is empty. Please leave it empty.
 * @param version
 */
    public addTestParameterFilesWithHttpInfo(
        workflowId: number,
        testParameterPaths: Array<string>,
        body?: string, version?: string,
        extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/workflows/${workflowId}/testParameterFiles`;

        const queryParameters = new URLSearchParams();
        const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'workflowId' is not null or undefined
        if (workflowId === null || workflowId === undefined) {
            throw new Error('Required parameter workflowId was null or undefined when calling addTestParameterFiles.');
        }
        // verify required parameter 'testParameterPaths' is not null or undefined
        if (testParameterPaths === null || testParameterPaths === undefined) {
            throw new Error('Required parameter testParameterPaths was null or undefined when calling addTestParameterFiles.');
        }
        if (testParameterPaths) {
            testParameterPaths.forEach((element) => {
                queryParameters.append('testParameterPaths', <any>element);
            });
        }

        if (version !== undefined) {

            queryParameters.set('version', <any>version);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        console.log(queryParameters);
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
     * Restub a workflow
     * Restubs a full, unpublished workflow.
     * @param workflowId workflow ID
     */
    public restubWithHttpInfo(workflowId: number, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/workflows/${workflowId}/restub`;

        const queryParameters = new URLSearchParams();
        const headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'workflowId' is not null or undefined
        if (workflowId === null || workflowId === undefined) {
            throw new Error('Required parameter workflowId was null or undefined when calling restub.');
        }
        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        const produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }
}
