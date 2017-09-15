import { validationPatterns } from './validationMessages.model';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ErrorService } from './../container/error.service';
import { Workflow } from './swagger/model/workflow';
import { Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { StateService } from './state.service';
import { Router } from '@angular/router/';
import { Subscription } from 'rxjs/Subscription';

import { CommunicatorService } from './communicator.service';
import { ProviderService } from './provider.service';

import { ContainerService } from '../shared/container.service';
import { TrackLoginService } from '../shared/track-login.service';

@Injectable()
export abstract class Entry implements OnInit, OnDestroy {
  protected labels: string[];
  protected shareURL: string;
  protected starGazersClicked = false;
  private totalShare = 0;
  protected title: string;
  protected _toolType: string;
  protected isLoggedIn: boolean;
  protected validVersions;
  protected defaultVersion;
  protected published: boolean;
  protected refreshing: boolean;
  public labelPattern = validationPatterns.label;
  public labelsEditMode: boolean;
  private loginSubscription: Subscription;
  protected error;
  @Input() isWorkflowPublic = true;
  @Input() isToolPublic = true;
  private publicPage: boolean;
  constructor(private trackLoginService: TrackLoginService,
    public providerService: ProviderService,
    public router: Router,
    private stateService: StateService,
    private errorService: ErrorService) {
  }

  ngOnInit() {
    this.subscriptions();
    const url = this.router.url;
    if (this.isPublic()) {
      this.setupPublicEntry(url);
    }
    this.stateService.setPublicPage(this.isPublic());
    this.errorService.toolError$.subscribe(toolError => this.error = toolError);
    this.stateService.publicPage$.subscribe(publicPage => this.publicPage = publicPage);
    this.stateService.refreshing.subscribe(refreshing => this.refreshing = refreshing);
    this.loginSubscription = this.trackLoginService.isLoggedIn$.subscribe(state => this.isLoggedIn = state);
  }

  closeError(): void {
    this.errorService.toolError$.next(null);
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
}
