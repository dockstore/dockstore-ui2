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
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Directive, Injectable, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router/';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Dockstore } from '../shared/dockstore.model';
import { Tag } from '../shared/swagger/model/tag';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { TrackLoginService } from '../shared/track-login.service';
import { AlertService } from './alert/state/alert.service';
import { BioschemaService } from './bioschema.service';
import { DateService } from './date.service';
import { EntryType } from './enum/entry-type';
import { GA4GHFilesService } from './ga4gh-files/ga4gh-files.service';
import { EntriesService, VersionVerifiedPlatform } from './openapi';
import { ProviderService } from './provider.service';
import { SessionQuery } from './session/session.query';
import { SessionService } from './session/session.service';
import { SourceFile } from './swagger';
import { UrlResolverService } from './url-resolver.service';
import { validationDescriptorPatterns, validationMessages } from './validationMessages.model';

@Directive()
@Injectable()
// tslint:disable-next-line: directive-class-suffix
export abstract class Entry implements OnInit, OnDestroy {
  @ViewChild('entryTabs') entryTabs: MatTabGroup;
  protected shareURL: string;
  public starGazersClicked = false;
  public title: string;
  protected _toolType: string;
  protected isLoggedIn: boolean;
  protected validVersions: Array<WorkflowVersion | Tag>;
  protected defaultVersion: WorkflowVersion | Tag;
  protected published: boolean;
  public labelPattern = validationDescriptorPatterns.label;
  public labelsEditMode: boolean;
  public error: boolean;
  public validTabs: Array<string>;
  public currentTab = 'info';
  public urlVersion: string;
  EntryType = EntryType;
  location: Location;
  public selectedVersion: WorkflowVersion | Tag | null = null;
  @Input() isWorkflowPublic = true;
  @Input() isToolPublic = true;
  public publicPage: boolean;
  public versionsFileTypes: Array<SourceFile.TypeEnum> = [];
  public versionsWithVerifiedPlatforms: Array<VersionVerifiedPlatform> = [];
  public validationMessage = validationMessages;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  protected selected = new FormControl(0);
  labelFormControl = new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$')]);
  public verifiedLink: string;
  constructor(
    private trackLoginService: TrackLoginService,
    public providerService: ProviderService,
    public router: Router,
    public dateService: DateService,
    public bioschemaService: BioschemaService,
    public urlResolverService: UrlResolverService,
    public activatedRoute: ActivatedRoute,
    public locationService: Location,
    protected sessionService: SessionService,
    protected sessionQuery: SessionQuery,
    protected gA4GHFilesService: GA4GHFilesService,
    protected alertService: AlertService,
    protected entryService: EntriesService
  ) {
    this.location = locationService;
    this.gA4GHFilesService.clearFiles();
  }

  ngOnInit() {
    this.clearState();
    this.subscriptions();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((event: RouterEvent) => {
        this.parseURL(event.url);
      });
    this.parseURL(this.router.url);
    this.sessionService.setPublicPage(this.isPublic());
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((publicPage) => (this.publicPage = publicPage));
    this.trackLoginService.isLoggedIn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => (this.isLoggedIn = state));
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  private parseURL(url: String): void {
    if (this.isPublic()) {
      this.title = this.getEntryPathFromURL();
      this.urlVersion = this.getVersionFromURL();
      this.setupPublicEntry(url);
    } else {
      if (this.entryTabs) {
        this.selectTab(0);
      }
    }
  }

  starGazersChange(): void {
    this.starGazersClicked = !this.starGazersClicked;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  abstract subscriptions(): void;
  abstract setProperties(): void;
  abstract getValidVersions(): void;
  abstract getDefaultVersionName(): string;
  abstract resetCopyBtn(): void;
  abstract isPublic(): boolean;
  abstract setupPublicEntry(url: String): void;
  /**
   * Upon entry init (either from the my-workflows page or public workflow page),
   * the previous active entry should be removed so that the component starts displaying with a the correct/current entry
   *
   * @abstract
   * @memberof Entry
   */
  abstract clearState(): void;

  toggleLabelsEditMode(): void {
    this.labelsEditMode = !this.labelsEditMode;
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

  updateTabSelection() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      const tabIndex = this.validTabs.indexOf(params['tab']);
      if (tabIndex > -1) {
        this.currentTab = this.validTabs[tabIndex];
      }
    });
  }

  /**
   * Given an array of WorkflowVersions or Tag, decide which one to return (displayed to the user)
   * 1. If the URL specifies a specific Tag or WorkflowVersion, choose to display that one.  Otherwise,
   * 2. If the default version is specified, choose to display the default version.  Otherwise,
   * 3. Choose the first version in the array (the last updated version?)
   * @param {((Array<WorkflowVersion | Tag>))} versions    All versions of an entry.
   * This is supposed to be (Array<WorkflowVersion> | Array<Tag>).
   * No idea why errors appear when attempted to do so.
   * @param {string} urlVersion  The version of the entry specified in the URL (possibly null or undefined)
   * @param {string} defaultVersion  The default version of an entry (possibly null or undefined)
   * @returns {((WorkflowVersion | Tag))}  The version to display to the user
   * @memberof Entry
   */
  public selectVersion(versions: Array<WorkflowVersion | Tag>, urlVersion: string, defaultVersion: string): WorkflowVersion | Tag | null {
    // if (!versions || versions.length === 0) {
    //   return null;
    // }
    let foundVersion: WorkflowVersion | Tag;
    if (urlVersion) {
      foundVersion = versions.find((version: WorkflowVersion | Tag) => version.name === urlVersion);
      if (foundVersion) {
        return foundVersion;
      }
    }
    if (defaultVersion) {
      foundVersion = versions.find((version: WorkflowVersion | Tag) => version.name === defaultVersion);
      if (foundVersion) {
        return foundVersion;
      }
    } else {
      return null;
    }
  }

  selectTag(versions: Array<Tag>, urlVersion: string, defaultVersion: string): Tag {
    if (!versions || versions.length === 0) {
      return null;
    }
    const selectedTag = this.selectVersion(versions, urlVersion, defaultVersion);
    return (
      selectedTag ||
      versions.reduce((a, b) => {
        // Fall back to dbUpdateDate when there's no last_built
        if (!b.last_built && !a.last_built) {
          return b.dbUpdateDate > a.dbUpdateDate ? b : a;
        }
        return b.last_built > a.last_built ? b : a;
      })
    );
  }

  selectWorkflowVersion(versions: Array<WorkflowVersion>, urlVersion: string, defaultVersion: string) {
    if (!versions || versions.length === 0) {
      return null;
    }
    const selectedWorkflowVersion = this.selectVersion(versions, urlVersion, defaultVersion);
    return selectedWorkflowVersion || versions.reduce((a, b) => (b.last_modified > a.last_modified ? b : a));
  }

  public getEntryPathFromURL(): string {
    return this.urlResolverService.getEntryPathFromUrl();
  }

  public getVersionFromURL(): string {
    return this.urlResolverService.getVersionFromURL();
  }

  /**
   * Selects a tab of index tabIndex (like clicking on a tab)
   * @param {number} tabIndex - index of tab to select
   * @returns {void}
   */
  selectTab(tabIndex: number): void {
    this.selected.setValue(tabIndex);
  }

  /**
   * Updates the URL to include the tab and sets the tab
   * @param {number} tabIndex - index of tab to select
   * @returns {void}
   */
  abstract setEntryTab(tabName: string): void;

  /**
   * Updates the URL with both tab and version information
   * @returns {void}
   */
  updateUrl(entryPath: string, myEntry: string, entry: string): void {
    if (this.publicPage) {
      const newPath = this.urlResolverService.getPath(entryPath, myEntry, entry, this.router.url, this.selectedVersion, this.currentTab);
      this.location.replaceState(newPath);
    }
  }

  updateVersionsFileTypes(entryId: number, versionid: number): void {
    this.alertService.start(`Getting version's unique file types`);
    this.entryService.getVersionsFileTypes(entryId, versionid).subscribe(
      (fileTypes: Array<SourceFile.TypeEnum>) => {
        this.versionsFileTypes = fileTypes;
        this.alertService.simpleSuccess();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.versionsFileTypes = [];
      }
    );
  }

  updateVerifiedPlatforms(entryId: number): void {
    this.entryService.getVerifiedPlatforms(entryId).subscribe(
      (verifiedVersions: Array<VersionVerifiedPlatform>) => {
        this.versionsWithVerifiedPlatforms = verifiedVersions.map((value) => Object.assign({}, value));
        this.alertService.simpleSuccess();
      },
      (error) => {
        this.alertService.detailedError(error);
        this.versionsWithVerifiedPlatforms = [];
      }
    );
  }

  /**
   * Sorts two entries by last modified, and then verified
   * @param {Tag|WorkflowVersion} a - version a
   * @param {Tag|WorkflowVersion} b - version b
   * @returns {number} - indicates order
   */

  verifiedSorting(a: Tag | WorkflowVersion, b: Tag | WorkflowVersion): number {
    if (a.verified && !b.verified) {
      return -1;
    } else if (!a.verified && b.verified) {
      return 1;
    } else {
      return 0;
    }
  }
  workflowVersionSorting(a: WorkflowVersion, b: WorkflowVersion): number {
    const verifiedSorting = this.verifiedSorting(a, b);
    if (verifiedSorting !== 0) {
      return verifiedSorting;
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

  tagSorting(a: Tag, b: Tag): number {
    const verifiedSorting = this.verifiedSorting(a, b);
    if (verifiedSorting !== 0) {
      return verifiedSorting;
    } else {
      if (a.last_built > b.last_built) {
        return -1;
      } else if (a.last_built < b.last_built) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent) {
    this.setEntryTab(matTabChangeEvent.tab.textLabel.toLowerCase());
  }

  /**
   * Sorts a list of versions by verified and then last_modified, returning a subset of the versions (1 default + 5 other versions max)
   * @param {Array<Tag|WorkflowVersion>} versions - Array of versions
   * @param {Tag|WorkflowVersion} defaultVersion - Default version of the entry
   * @returns {Array<any>} Sorted array of versions
   */
  getSortedVersions(
    versions: Array<Tag | WorkflowVersion>,
    defaultVersion: Tag | WorkflowVersion,
    sortedVersions: Array<Tag | WorkflowVersion>
  ): Array<Tag | WorkflowVersion> {
    // Get the top 6 versions
    const recentVersions: Array<Tag | WorkflowVersion> = sortedVersions.slice(0, 6);
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

  getSortedWorkflowVersions(versions: Array<WorkflowVersion>, defaultVersion: WorkflowVersion): Array<WorkflowVersion> {
    const sortedWorkflowVersions: Array<WorkflowVersion> = versions.slice().sort((a, b) => this.workflowVersionSorting(a, b));
    return this.getSortedVersions(versions, defaultVersion, sortedWorkflowVersions);
  }

  getSortedTags(versions: Array<Tag>, defaultVersion: WorkflowVersion): Array<Tag> {
    const sortedTags: Array<Tag> = versions.slice().sort((a, b) => this.tagSorting(a, b));
    return this.getSortedVersions(versions, defaultVersion, sortedTags);
  }

  /**
   * Will decode the URL
   * @return {void}
   */
  decodeURL(type: string): void {
    const url = decodeURIComponent(window.location.href);
    const containersIndex = this.getIndexInURL('/' + type);
    const newPath = url.substring(containersIndex);
    this.location.replaceState(newPath);
  }

  /**
   * Determine the index of a string in the current URL
   * @return {number}
   */
  getIndexInURL(page: string): number {
    return window.location.href.indexOf(page);
  }

  /**
   * Determine the index of a string in the current URL, starting at an offset
   * @return {number}
   */
  getIndexInURLFrom(page: string, startFrom: number): number {
    return window.location.href.indexOf(page, startFrom);
  }

  /**
   * Deals with redirecting to canonical URL
   * @return {void}
   */
  redirectToCanonicalURL(myPage: string): void {
    if (this.getIndexInURL(myPage) === -1) {
      // Decode the URL
      this.decodeURL(this._toolType);

      // Get index of /containers or /workflows
      // TODO: Not sure why getPageIndex() returns anything, but does need to get called to change URL.
      this.getPageIndex();
    }
  }

  /**
   * Creates discourse embed based on topic ID
   * @param topicId The ID of the topic on discourse
   */
  discourseHelper(topicId: number): void {
    const element = document.getElementById('discourse-embed-frame');
    if (element !== null) {
      element.remove();
    }
    (<any>window).DiscourseEmbed = {
      discourseUrl: Dockstore.DISCOURSE_URL + '/',
      topicId: topicId,
    };
    (function () {
      const d = document.createElement('script');
      d.type = 'text/javascript';
      d.async = true;
      d.src = (<any>window).DiscourseEmbed.discourseUrl + '/javascripts/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(d);
    })();
  }

  /**
   * Gets the index of /containers or /workflows from the URL
   * @return {number}
   */
  abstract getPageIndex(): number;

  /**
   * Go to the search page with a query preloaded
   * @param {string} searchValue Value to search for
   */
  goToSearch(searchValue: string): void {
    window.location.href = '/search?labels.value.keyword=' + searchValue + '&searchMode=files';
  }

  /**
   * Adds a label to the labels list
   * @param  event Add chip event
   */
  abstract addToLabels(event: MatChipInputEvent): void;

  /**
   * Removes a label from the list of labels (does not update in database)
   * @param  label label to remove
   */
  abstract removeLabel(label: any): void;

  /**
   * Cancels any unsaved label changes
   */
  abstract cancelLabelChanges(): void;
}
