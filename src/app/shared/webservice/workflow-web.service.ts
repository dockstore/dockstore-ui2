import { PublishRequest } from './../models/PublishRequest';
import { RequestMethod, URLSearchParams } from '@angular/http';
import { Dockstore } from './../dockstore.model';
import { HttpService } from './../http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WorkflowWebService {

    constructor(private httpService: HttpService) { }
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
