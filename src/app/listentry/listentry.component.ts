import { AfterViewInit, Component, Input, OnInit, ViewChild,  Output, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { SearchComponent } from '../search/search.component';
import { DataTableDirective } from 'angular-datatables';
import { ListContainersService } from '../containers/list/list.service';
import { CommunicatorService } from '../shared/communicator.service';
import { PagenumberService } from '../shared/pagenumber.service';

@Component({
  selector: 'app-listentry',
  templateUrl: './listentry.component.html',
  styleUrls: ['./listentry.component.css']
})
export class ListentryComponent implements OnInit {
  @Input() entryType: string;
  @Output() userUpdated = new EventEmitter();
  hits: any;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  inited = false;

  private entrySubscription: Subscription;
  constructor(private communicatorService: CommunicatorService,
              private searchComponent: SearchComponent,
              private listContainersService: ListContainersService) { }

  ngOnInit() {
    if (this.entryType === 'tool') {
      this.entrySubscription = this.searchComponent.toolhit$.subscribe(
        hits => {
          this.setHitSubscribe(hits);
        });
    } else if (this.entryType === 'workflow') {
      this.entrySubscription = this.searchComponent.workflowhit$.subscribe(
        hits => {
          this.setHitSubscribe(hits);
        });
    }
  }
  setHitSubscribe(hits: any) {
    if (this.inited) {
      this.rerender(hits);
    } else {
      if (hits) {
        this.hits = hits;
        this.dtTrigger.next();
        this.inited = true;
      }
    }
  }

  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }
  sendToolInfo(tool) {
    this.communicatorService.setTool(tool);
    this.userUpdated.emit();
  }
  rerender(hits: any): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.hits = hits;
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
