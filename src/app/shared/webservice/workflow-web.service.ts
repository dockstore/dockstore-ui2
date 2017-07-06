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

        console.log('stuff happened');
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
}
