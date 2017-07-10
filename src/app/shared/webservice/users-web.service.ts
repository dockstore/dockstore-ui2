import { Dockstore } from './../dockstore.model';
import { HttpService } from './../http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UsersWebService {

    constructor(private httpService: HttpService) { }

    /**
    *
	* @method
	* @name refresh
	* @param {integer} userId - User ID
	*
	*/
    public refresh(userId: number) {
        const uri = `/users/${userId}/containers/refresh`;
        const url = Dockstore.API_URI + uri;
        return this.httpService.getAuthResponse(url);
    }

    /**
    *
    * @method
    * @name refreshWorkflows
    * @param {integer} userId - User ID
    *
    */
    public refreshWorkflows(userId: number) {
        const uri = `/users/${userId}/workflows/refresh`;
        const url = Dockstore.API_URI + uri;
        return this.httpService.getAuthResponse(url);
    }
}
