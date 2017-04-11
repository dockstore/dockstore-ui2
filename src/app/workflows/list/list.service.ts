import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';

@Injectable()
export class ListWorkflowsService {

  readonly publishedWorkflowsUrl = Dockstore.API_URI + '/workflows/published';

  constructor(private dockstoreService: DockstoreService) { }

  getPublishedWorkflows() {
    return this.dockstoreService.getResponse(this.publishedWorkflowsUrl);
  }

  getProvider(gitUrl: string): string {
    return this.dockstoreService.getProvider(gitUrl);
  }

  getProviderUrl(gitUrl: string, provider: string): string {
    return this.dockstoreService.getProviderUrl(gitUrl, provider);
  }
}
