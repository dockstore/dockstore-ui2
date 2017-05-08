import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';

import { HttpService } from '../../shared/http.service';

@Injectable()
export class DockerfileService {

  constructor(private httpService: HttpService) { }

  getDockerfile(toolId: number, tag: string) {
    let dockerFileUrl = `${ Dockstore.API_URI }/containers/${ toolId }/dockerfile`;

    if (tag) {
      dockerFileUrl += '?tag=' + tag;
    }

    return this.httpService.getResponse(dockerFileUrl);
  }

}
