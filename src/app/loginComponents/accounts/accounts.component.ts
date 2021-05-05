import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params } from '@angular/router';
import { NavbarService } from 'app/navbar/navbar.service';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
})
export class AccountsComponent extends Base implements OnInit {
  public currentTab = 'accounts'; // default to the 'accounts' tab
  readonly pageName = '/accounts';
  selected = new FormControl();
  validTabs = ['accounts', 'profiles', 'dockstore account controls', 'requests'];
  constructor(private location: Location, private activatedRoute: ActivatedRoute, private navbarService: NavbarService) {
    super();
  }

  ngOnInit() {
    localStorage.setItem('page', this.pageName);
    this.navbarService.setActivePage(this.pageName);
    this.parseParam(this.activatedRoute.queryParams);
  }

  private parseParam(params: Observable<Params>): void {
    params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((next) => {
      this.setupTab(next);
    });
  }

  public setupTab(params: Params) {
    const match: string = params['tab'];
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
}
