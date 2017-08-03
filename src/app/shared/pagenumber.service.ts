import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable, OnInit} from '@angular/core';
import { Router } from '@angular/router/';
import { Subscription } from 'rxjs/Subscription';
import { PageInfo } from './../shared/models/PageInfo';

@Injectable()
export class PagenumberService {
  private pgNumToolsSource = new BehaviorSubject<any>(null);
  pgNumTools$ = this.pgNumToolsSource.asObservable(); // This is the selected tool

  private pgNumWorkflowsSource = new BehaviorSubject<any>(null);
  pgNumWorkflows$ = this.pgNumWorkflowsSource.asObservable(); // This is the selected tool

  private backRouteSource = new BehaviorSubject<any>(null);
  private backRoute$ = this.backRouteSource.asObservable();
  needSetPageNumber: boolean;
  constructor(private router: Router) {
    this.needSetPageNumber = false;
  }
  setToolsPageInfo(pginfo: PageInfo) {
    this.pgNumToolsSource.next(pginfo);
  }
  setWorkflowPageInfo(pginfo: PageInfo) {
    this.pgNumWorkflowsSource.next(pginfo);
  }
  setBackRoute(backRoute) {
    this.backRouteSource.next(backRoute);
  }
}
