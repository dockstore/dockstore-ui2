import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit, OnDestroy {
  public currentTab = 'accounts'; // default to the 'accounts' tab
  selected = new FormControl();
  validTabs = ['accounts', 'profiles', 'dockstore account controls', 'requests'];
  subscription = null;
  constructor(private location: Location, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    localStorage.setItem('page', '/accounts');
    this.parseParam(this.activatedRoute.queryParams);
  }

  private parseParam(params: Observable<Params>): void {
    this.subscription = params.subscribe(next => {
      this.setupTab(next);
    });
  }

  public setupTab(u: Params) {
    const match: string = u['tab'];
    if (match) {
      // look for a tab name in the url
      const tabIndex = this.validTabs.indexOf(match);
      if (tabIndex >= 0) {
        this.currentTab = match; // if found, set the tab accordingly
      }
    } // if not found, default to the 'accounts' tab
    this.selectTab(this.validTabs.indexOf(this.currentTab));
    this.setAccountsTab();
  }

  selectTab(tabIndex: number): void {
    // called on setup
    this.selected.setValue(tabIndex);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    // called on tab change event
    this.currentTab = matTabChangeEvent.tab.textLabel.toLowerCase();
    this.setAccountsTab();
  }

  setAccountsTab() {
    this.location.replaceState('accounts?tab=' + this.currentTab);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
