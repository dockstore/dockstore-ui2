import { DateService } from './date.service';
/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { validationPatterns } from './validationMessages.model';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ErrorService } from './../shared/error.service';
import { Workflow } from './swagger/model/workflow';
import { Injectable, Input, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { StateService } from './state.service';
import { Router } from '@angular/router/';
import { Subscription } from 'rxjs/Subscription';
import { TabsetComponent } from 'ngx-bootstrap';

import { CommunicatorService } from './communicator.service';
import { ProviderService } from './provider.service';

import { ContainerService } from '../shared/container.service';
import { TrackLoginService } from '../shared/track-login.service';

import { Tag } from '../shared/swagger/model/tag';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';

@Injectable()
export abstract class Entry implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('entryTabs') entryTabs: TabsetComponent;
  protected labels: string[];
  protected shareURL: string;
  public starGazersClicked = false;
  private totalShare = 0;
  public title: string;
  protected _toolType: string;
  protected isLoggedIn: boolean;
  protected validVersions;
  protected defaultVersion;
  protected published: boolean;
  protected refreshMessage: string;
  public labelPattern = validationPatterns.label;
  public labelsEditMode: boolean;
  private loginSubscription: Subscription;
  public error;
  @Input() isWorkflowPublic = true;
  @Input() isToolPublic = true;
  public publicPage: boolean;
  constructor(private trackLoginService: TrackLoginService,
    public providerService: ProviderService,
    public router: Router,
    private stateService: StateService,
    private errorService: ErrorService, public dateService: DateService) {
  }

  ngOnInit() {
    this.subscriptions();
    const url = this.router.url;
    if (this.isPublic()) {
      this.setupPublicEntry(url);
    }
    this.stateService.setPublicPage(this.isPublic());
    this.errorService.errorObj$.subscribe(toolError => this.error = toolError);
    this.stateService.publicPage$.subscribe(publicPage => this.publicPage = publicPage);
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.loginSubscription = this.trackLoginService.isLoggedIn$.subscribe(state => this.isLoggedIn = state);
  }

  getVerifiedLink(): string {
    return this.dateService.getVerifiedLink();
  }

  closeError(): void {
    this.errorService.errorObj$.next(null);
  }

  starGazersChange(): void {
    this.starGazersClicked = !this.starGazersClicked;
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  abstract onDestroy(): void;
  abstract subscriptions(): void;
  abstract setProperties(): void;
  abstract getValidVersions(): void;
  abstract publishDisable(): boolean;
  abstract refresh(): void;
  abstract publish(): void;
  abstract getDefaultVersionName(): string;
  abstract resetCopyBtn(): void;
  abstract isPublic(): boolean;
  abstract setupPublicEntry(url: String): void;

  toggleLabelsEditMode(): void {
    this.labelsEditMode = !this.labelsEditMode;
  }

  sumCounts(count): void {
    this.totalShare += count;
  }

  protected initTool(): void {
    this.setProperties();
    this.getValidVersions();
    this.chooseDefaultVersion();
    this.resetCopyBtn();
  }

  private chooseDefaultVersion(): void {
    let defaultVersionName = this.getDefaultVersionName();
    // if user did not specify a default version, use the latest version
    if (!defaultVersionName) {
      if (this.validVersions.length) {
        const last: number = this.validVersions.length - 1;
        defaultVersionName = this.validVersions[last].name;
      }
    }
    this.defaultVersion = this.getDefaultVersion(defaultVersionName);
  }

  private getDefaultVersion(defaultVersionName: string) {
    for (const version of this.validVersions) {
      if (version.name === defaultVersionName) {
        return version;
      }
    }
  }

  public encodedString(url: string): string {
    if (!this.isEncoded(url)) {
      return encodeURIComponent(url);
    }
    return url;
  }

  public decodedString(url: string): string {
    if (this.isEncoded(url)) {
      return decodeURIComponent(url);
    }
    return url;
  }

  private isEncoded(uri: string): boolean {
    if (uri) {
      return uri !== decodeURIComponent(uri);
    }
    return null;
  }

  // Embed Discourse comments into page
  ngAfterViewInit() {
    if (this.publicPage) {
      (function() {
        const d = document.createElement('script'); d.type = 'text/javascript'; d.async = true;
        d.src = (<any>window).DiscourseEmbed.discourseUrl + 'javascripts/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(d);
      })();
    }
  }

  public selectVersion(versions, urlVersion, defaultVersion, selectedVersion): any {
    let useFirstTag = true;
    let urlTagExists = false;
    // Determine which tag to select
    for (const item of versions) {
      // If a tag is specified in the URL then use it
      if (urlVersion !== null) {
        if (item.name === urlVersion) {
          selectedVersion = item;
          useFirstTag = false;
          urlTagExists = true;
          break;
        }
      }
      if (defaultVersion !== null && !urlTagExists) {
        // If the tool has a default version then use it
        if (item.name === defaultVersion) {
          selectedVersion = item;
          useFirstTag = false;
          break;
        }
      }
    }

    // If no url tag or default version, select first element in the dropdown
    if (useFirstTag && versions.length > 0) {
      selectedVersion = versions[0];
    }
    return selectedVersion;
  }

  /**
   * Selects a tab of index tabIndex
   * @param {number} tabIndex - index of tab to select
   * @returns {void}
   */
  selectTab(tabIndex: number): void {
    this.entryTabs.tabs[tabIndex].active = true;
  }

  /**
   * Sorts two entries by last modified, and then verified
   * @param {Tag|WorkflowVersion} a - version a
   * @param {Tag|WorkflowVersion} b - version b
   * @returns {number} - indicates order
   */
  entryVersionSorting(a: Tag|WorkflowVersion, b: Tag|WorkflowVersion): number {
    if (a.verified && !b.verified) {
      return -1;
    } else if (!a.verified && b.verified) {
      return 1;
    } else {
      if (a.last_modified > b.last_modified) {
        return -1;
      } else if (a.last_modified < b.last_modified) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  /**
   * Sorts a list of versions by verified and then last_modified, returning a subset of the versions (1 default + 5 other versions max)
   * @param {Array<Tag|WorkflowVersion>} versions - Array of versions
   * @param {Tag|WorkflowVersion} defaultVersion - Default version of the entry
   * @returns {Array<any>} Sorted array of versions
   */
  getSortedVersions(versions: Array<Tag|WorkflowVersion>, defaultVersion: Tag|WorkflowVersion): Array<Tag|WorkflowVersion> {
    let sortedVersions: Array<Tag|WorkflowVersion> = [];

    // Sort versions by verified date and then last_modified
    sortedVersions = versions.sort((a, b) => this.entryVersionSorting(a, b));

    // Get the top 6 versions
    const recentVersions: Array<Tag|WorkflowVersion> = sortedVersions.slice(0, 6);
    const index = recentVersions.indexOf(defaultVersion);

    // Deal with default version if it exists
    if (defaultVersion) {
      if (index === -1) {
        // Remove extra version if necessary
        if (recentVersions.length > 5) {
          recentVersions.splice(-1, 1);
        }
      } else {
        // Remove existing default version if exists
        recentVersions.splice(index, 1);
      }

      // Push default version to the top
      recentVersions.unshift(defaultVersion);
    }

    return recentVersions;
  }
}
