import { Component, Input, ViewChild} from '@angular/core';
import { CommunicatorService } from '../../shared/communicator.service';
import { Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { ToolLister } from '../../shared/tool-lister';
import { DataTableDirective } from 'angular-datatables';
import { ListService } from '../../shared/list.service';
import { ProviderService } from '../../shared/provider.service';
import { PagenumberService } from '../../shared/pagenumber.service';
import { WorkflowService } from '../../shared/workflow.service';
import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html'
})
export class ListWorkflowsComponent extends ToolLister {
  @Input() previewMode: boolean;
  @Input() entryType: string;
  dtTrigger: Subject<any> = new Subject();
  private pageNumberSubscription: Subscription;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  // TODO: make an API endpoint to retrieve only the necessary properties for the workflows table
  dtOptions = {
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        self.findPageNumber(index);
      });
      return row;
    }
  };
  constructor(private communicatorService: CommunicatorService,
              private workflowService: WorkflowService,
              private dockstoreService: DockstoreService,
              private pagenumberService: PagenumberService,
              listService: ListService, providerService: ProviderService) {
    super(listService, providerService, 'workflows');
  }

  sendWorkflowInfo(workflow) {
    this.communicatorService.setWorkflow(workflow);
    this.workflowService.setWorkflow(workflow);
  }

  findPageNumber(index: any) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let realPG: number;
      realPG = ((dtInstance.page.info().length * dtInstance.page.info().page) + index ) / 10;
      console.log('REAL PG NUMBER: ' + Math.floor(realPG));
      this.pagenumberService.setWorkflowPageNumber(Math.floor(realPG));
      this.pagenumberService.setBackRoute('workflows');
    });
  }

  initToolLister(): void {
    this.dtTrigger.next();
    this.setupPageNumber();
  }

  setupPageNumber() {
    this.pageNumberSubscription = this.pagenumberService.pgNumWorkflows$.subscribe(
      pageNum => {
        if (pageNum) {
          console.log(pageNum);
          if (this.dtElement) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.page(pageNum).draw(false);
              console.log(dtInstance.page.info());
            });
          }
        }
      });
  }
  getVerified(workflow) {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
