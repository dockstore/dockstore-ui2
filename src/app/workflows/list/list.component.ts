import { Component, Input } from '@angular/core';

import { ToolLister } from '../../shared/tool-lister';

import { ListService } from '../../shared/list.service';
import { ProviderService } from '../../shared/provider.service';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html'
})
export class ListWorkflowsComponent extends ToolLister {
@Input() previewMode: boolean;
  // TODO: make an API endpoint to retrieve only the necessary properties for the workflows table
  // gitUrl

  constructor(listService: ListService, providerService: ProviderService) {
    super(listService, providerService, 'workflows');
  }

  initToolLister(): void { }

}
