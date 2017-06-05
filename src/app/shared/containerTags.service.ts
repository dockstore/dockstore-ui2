import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Dockstore } from './dockstore.model';
import { HttpService } from './http.service';

@Injectable()
export class ContainerTagsService {
  constructor(private httpService: HttpService) { }

  private getTags(containerId: number) {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/containers/path/${ containerId }/tags`);
  }

  private postTags(containerId: number, tags) {
    return this.httpService.postResponse(`${ Dockstore.API_URI }/containers/${ containerId }/tags`, tags);
  }

  private putTags(containerId: number, tags) {
    return this.httpService.putResponse(`${ Dockstore.API_URI }/containers/${ containerId }/tags`, tags);
  }

  private deleteTag(containerId: number, tagId: number) {
    return this.httpService.delete(`${ Dockstore.API_URI }/containers/${ containerId }/tags/${ tagId }`);
  }

  private putVerifyTag(containerId: number, tagId: number, body) {
    return this.httpService.putResponse(`${ Dockstore.API_URI }/containers/${ containerId }/verify/${ tagId }`, body);
  }
}
