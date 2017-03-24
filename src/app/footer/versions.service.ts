import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';

@Injectable()
export class VersionsService {

  readonly versionUrl = Dockstore.API_URI + '/api/ga4gh/v1/metadata';

  constructor(private dockstoreService: DockstoreService) { }

  getVersion() {
    return this.dockstoreService.getResponse(this.versionUrl);
  }
}
