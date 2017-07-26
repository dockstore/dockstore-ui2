import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable, OnInit} from '@angular/core';
import { Router } from '@angular/router/';
import { Subscription } from 'rxjs/Subscription';

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
  setToolsPageNumber(pgnum: number) {
    this.pgNumToolsSource.next(pgnum);
  }
  setWorkflowPageNumber(pgnum: number) {
    this.pgNumWorkflowsSource.next(pgnum);
  }
  setBackRoute(backRoute) {
    this.backRouteSource.next(backRoute);
  }
  getNeedSetPageNumber() {
    return this.needSetPageNumber;
  }
  setNeedSetPageNumber(needSet: boolean) {
    this.needSetPageNumber = needSet;
  }
}
