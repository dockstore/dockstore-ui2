import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ErrorService } from '../../shared/error.service';
import { SessionQuery } from '../session/session.query';

// TODO: Rename this component to something like 'alert' since it contains both error and refresh alerts
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  public refreshMessage: string;
  public errorObj: any;

  private ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private sessionQuery: SessionQuery, private errorService: ErrorService) { }

  ngOnInit() {
    this.sessionQuery.refreshMessage$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.errorService.errorObj$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(errorObj => this.errorObj = errorObj);
  }

  clearError() {
    this.errorService.setErrorAlert(null);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
