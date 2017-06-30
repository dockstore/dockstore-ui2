import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Dockstore } from './dockstore.model';
import { HttpService } from './http.service';

@Injectable()
export class ContainerTagsService {
  constructor(private httpService: HttpService) { }

  public getTags(containerId: number) {
    return this.httpService.getAuthResponse(`${ Dockstore.API_URI }/containers/path/${ containerId }/tags`);
  }

  public postTags(containerId: number, tags) {
    return this.httpService.postResponse(`${ Dockstore.API_URI }/containers/${ containerId }/tags`, [tags]);
  }

  public putTags(containerId: number, tags) {
    return this.httpService.putResponse(`${ Dockstore.API_URI }/containers/${ containerId }/tags`, [tags]);
  }

  public deleteTag(containerId: number, tagId: number) {
    return this.httpService.delete(`${ Dockstore.API_URI }/containers/${ containerId }/tags/${ tagId }`);
  }

  public putVerifyTag(containerId: number, tagId: number, body) {
    return this.httpService.putResponse(`${ Dockstore.API_URI }/containers/${ containerId }/verify/${ tagId }`, body);
  }
}
