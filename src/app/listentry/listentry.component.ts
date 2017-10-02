import { SearchService } from './../search/search.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild,  Output, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { SearchComponent } from '../search/search.component';
import { DataTableDirective } from 'angular-datatables';
import { ListContainersService } from '../containers/list/list.service';
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
  dtOptions: any;

  private entrySubscription: Subscription;
  constructor(private searchService: SearchService,
              private listContainersService: ListContainersService) { }

  ngOnInit() {
    this.dtOptions = {searching: false};
    if (this.entryType === 'tool') {
      this.entrySubscription = this.searchService.toolhit$.subscribe(
        hits => {
          this.setHitSubscribe(hits);
        });
    } else if (this.entryType === 'workflow') {
      this.entrySubscription = this.searchService.workflowhit$.subscribe(
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
