import {Injectable, OnDestroy, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {ToolService} from './tool.service';
import {CommunicatorService} from './communicator.service';
import {ProviderService} from './provider.service';
import {UserService} from '../loginComponents/user.service';

/* TODO: try this...*/
import { WorkflowObjService } from '../shared/workflow.service';

@Injectable()
export abstract class Foo implements OnInit, OnDestroy {

  protected title: string;
  protected _toolType: string;

  protected validVersions;
  protected defaultVersion;

  protected tool;
  protected workflow;

  private routeSub: Subscription;
  private subscription: Subscription;
  @Input() isPublic = true;
  constructor(private toolService: ToolService,
              private communicatorService: CommunicatorService,
              private providerService: ProviderService,
              private userService: UserService,
              private router: Router,
              private workflowObjService: WorkflowObjService,
              toolType: string) {
    this._toolType = toolType;
    this.subscription = workflowObjService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        this.setUpWorkflow(workflow);
      }
    );
  }

  ngOnInit() {
    console.log(this.isPublic);
    if (this.isPublic) {
      this.routeSub = this.router.events.subscribe(event =>
        this.urlWorkflowChanged(event)
      );
    } else {
      this.setUpWorkflow(this.communicatorService.getWorkflow());
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.subscription.unsubscribe();
  }

  abstract setProperties(): void;
  abstract getValidVersions(): void;

  protected setToolObj(tool: any) {
    this.communicatorService.setTool(tool);
    if (!tool.providerUrl) {
      this.providerService.setUpProvider(tool);
    }
    this.tool = Object.assign(tool, this.tool);
    this.initTool();
  }
  protected setUpWorkflow(workflow: any) {
    if (workflow) {
      this.workflow = workflow;
      if (!workflow.providerUrl) {
        this.providerService.setUpProvider(workflow);
      }
      this.workflow = Object.assign(workflow, this.workflow);
      this.title = this.workflow.path;
      this.initTool();
    }
  }

  private urlToolChanged(event) {
    // reuse provider and image provider
    this.tool = this.communicatorService.getTool();
    // cannot reuse provider and image provider
    // navigated to tool's page without visiting table
    if (!this.tool) {
      this.title = this.decodedString(event.url.replace(`/${ this._toolType }/`, ''));
    } else {
      this.title = this.tool.path;
    }
    // check if it is a private tool or a public tool.
    if (this._toolType === 'containers') {
      this.toolService.getPublishedToolByPath(this.encodedString(this.title), this._toolType)
        .subscribe(toolArray => {
          // TODO: endpoint should return a single object instead of an array
          this.setUpTool(toolArray);
        }, error => {
          this.router.navigate(['../']);
        });
    }
  }

  private urlWorkflowChanged(event) {
    // reuse provider and image provider
      if (!this.workflow) {
        this.title = this.decodedString(event.url.replace(`/${ this._toolType }/`, ''));
      } else {
        this.title = this.workflow.path;
      }
      this.toolService.getPublishedWorkflowByPath(this.encodedString(this.title), this._toolType)
        .subscribe(workflow => {
            this.setUpWorkflow(workflow);
          }, error => {
            this.router.navigate(['../']);
          }
        );
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
  }

  private chooseDefaultVersion() {
    let defaultVersionName;
    if (this._toolType === 'workflows') {
      defaultVersionName = this.workflow.defaultVersion;
    } else {
      defaultVersionName = this.tool.defaultVersion;
    }
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
