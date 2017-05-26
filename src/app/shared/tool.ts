import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {ToolService} from './tool.service';
import {CommunicatorService} from './communicator.service';
import {ProviderService} from './provider.service';
import {UserService} from '../loginComponents/user.service';

@Injectable()
export abstract class Tool implements OnInit, OnDestroy {

  protected title: string;
  protected _toolType: string;

  protected validVersions;
  protected defaultVersion;

  protected tool;

  private routeSub: Subscription;
  private userToolURL: string;

  constructor(private toolService: ToolService,
              private communicatorService: CommunicatorService,
              private providerService: ProviderService,
              private userService: UserService,
              private router: Router,
              toolType: string) {
    this._toolType = toolType;
    this.userToolURL = '/mytools';
  }

  ngOnInit() {
    console.log('$$$$$$$$$$$$ tool.ts OnInit');
    this.routeSub = this.router.events.subscribe(event =>
        this.urlChanged(event)
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  abstract setProperties(): void;
  abstract getValidVersions(): void;

  protected foo(){
    alert('hiiiii');
  }

  protected setToolObj(tool: any) {
    this.communicatorService.setObj(tool);
    this.updateTool();
  }

  protected updateTool() {
    const tool = this.communicatorService.getObj();
    this.tool = Object.assign(tool, this.tool);
    this.title = this.tool.tool_path;
    this.initTool();
  }

  private urlChanged(event) {
    // reuse provider and image provider
    console.log(event);
    this.tool = this.communicatorService.getObj();
    console.log(this.tool);
    // cannot reuse provider and image provider
    // navigated to tool's page without visiting table
    if (!this.tool) {
      this.title = this.decodedString(event.url.replace(`/${ this._toolType }/`, ''));
    } else {
      this.title = this.tool.path;
    }
    // check if it is a private tool or a public tool.
    if (event.url === this.userToolURL) {
      this.userService.getUser().subscribe(user => {
        this.userService.getUserTools(user.id).subscribe(toolArray => {
          this.setUpTool(toolArray);
          this.title = this.tool.tool_path;
        });
      });
    } else {
      this.toolService.getPublishedToolByPath(this.encodedString(this.title), this._toolType)
        .subscribe(toolArray => {
          // TODO: endpoint should return a single object instead of an array
          console.log(toolArray);
          this.setUpTool(toolArray);
        }, error => {
          this.router.navigate(['../']);
        });
    }
  }


  private setUpTool(toolArray: Array<any>) {
    if (toolArray.length) {
      const tool = toolArray[0];
      if (!tool.providerUrl) {
        this.providerService.setUpProvider(tool);
      }
      this.tool = Object.assign(tool, this.tool);
      this.initTool();
    }
  }

  private initTool() {
    this.setProperties();
    this.getValidVersions();
    this.chooseDefaultVersion();
    console.log(this.defaultVersion);
  }

  private chooseDefaultVersion() {
    let defaultVersionName = this.tool.defaultVersion;

    // if user did not specify a default version, use the latest version
    if (!defaultVersionName) {
      console.log(this.validVersions);
      if (this.validVersions.length) {
        const last: number = this.validVersions.length - 1;

        defaultVersionName = this.validVersions[last].name;
      }
    }

    this.defaultVersion = this.getDefaultVersion(this.tool, defaultVersionName);
  }

  private getDefaultVersion(tool, defaultVersionName: string) {
    for (const version of this.validVersions) {
      if (version.name === defaultVersionName) {
        return version;
      }
    }
  }

  private encodedString(url: string): string {
    if (!this.isEncoded(url)) {
      return encodeURIComponent(url);
    }

    return url;
  }

  private decodedString(url: string): string {
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
