import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  public currentTab = 'accounts'; // default to the 'accounts' tab
  selected = new FormControl(0);
  validTabs = ['accounts', 'profiles', 'dockstore account controls', 'requests'];
  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
    localStorage.setItem('page', '/accounts');
    this.parseURL(this.router.url);
  }

  private parseURL(url: string): void {
    const decodedUrl: string = decodeURIComponent(url.toString()); // decode any encoded spaces, etc. in the string
    const strippedUrl: string = decodedUrl.endsWith('/') ? decodedUrl.slice(0, -1) : decodedUrl; // remove any trailing slash
    this.setupTab(strippedUrl);
  }

  public setupTab(url: string) {
    const u = new URL(url);
    const match = u.searchParams.get('tab');
    if (match) {
      // look for a tab name in the url
      const tabIndex = this.validTabs.indexOf(match[1]);
      if (tabIndex >= 0) {
        this.currentTab = match[1]; // if found, set the tab accordingly
      }
    } // if not found, default to the 'accounts' tab
    this.selectTab(this.validTabs.indexOf(this.currentTab));
    this.setAccountsTab(this.currentTab);
  }

  selectTab(tabIndex: number): void {
    // called on setup
    this.selected.setValue(tabIndex);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    // called on tab change event
    this.setAccountsTab(matTabChangeEvent.tab.textLabel.toLowerCase());
  }

  setAccountsTab(tabName: string) {
    this.currentTab = tabName;
    this.location.replaceState('accounts?tab=' + tabName);
  }
}
