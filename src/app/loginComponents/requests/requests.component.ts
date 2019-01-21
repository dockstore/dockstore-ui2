import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../state/requests.service';
import { RequestsQuery } from '../state/requests.query';
import { Request } from '../state/request.model';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Organisation } from '../../shared/swagger';
import { AlertQuery } from '../../shared/alert/state/alert.query';

@Component({
  selector: 'requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  loading$: Observable<boolean>;
  public organizations$: Observable<Array<Organisation>>;

  constructor(private requestsQuery: RequestsQuery,
              private requestsService: RequestsService,
              private alertQuery: AlertQuery
  ) { }

  ngOnInit() {
    this.loading$ = this.alertQuery.showInfo$;
    this.requestsService.updateOrganizations();
    this.organizations$ = this.requestsQuery.organizations$;
  }
}
