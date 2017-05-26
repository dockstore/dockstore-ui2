import { Injectable } from '@angular/core';

import { Dockstore } from './dockstore.model';

import { HttpService } from './http.service';

@Injectable()
export class ListService {

  constructor(private httpService: HttpService) { }

  getPublishedTools(toolType: string) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/${ toolType }/published`);
  }

  getUserTools(userId: number) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/users/${ userId }/containers`);
  }
}
