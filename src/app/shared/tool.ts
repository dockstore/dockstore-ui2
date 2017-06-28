import {Injectable, OnDestroy, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {ToolService} from './tool.service';
import {CommunicatorService} from './communicator.service';
import {ProviderService} from './provider.service';
import {UserService} from '../loginComponents/user.service';

import { WorkflowService } from './workflow.service';
import { ContainerService } from '../shared/container.service';
@Injectable()
export abstract class Tool implements OnInit, OnDestroy {

  protected title: string;
  protected _toolType: string;

  protected validVersions;
  protected defaultVersion;

  protected tool;
  protected workflow;
  protected published: boolean;
  private routeSub: Subscription;
  private workflowSubscription: Subscription;
  private toolSubscription: Subscription;
  @Input() isWorkflowPublic = true;
  @Input() isToolPublic = true;
  constructor(private toolService: ToolService,
              private communicatorService: CommunicatorService,
              private providerService: ProviderService,
              private router: Router,
              private workflowService: WorkflowService,
              private containerService: ContainerService,
              toolType: string) {
    this._toolType = toolType;
  }

  ngOnInit() {
    this.workflowSubscription = this.workflowService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        this.setUpWorkflow(workflow);
      }
    );
    this.toolSubscription = this.containerService.tool$.subscribe(
      tool => {
        this.tool = tool;
        if (tool) {
          this.published = this.tool.is_published;
        }
        this.setUpTool(tool);
      }
    );
    if (this._toolType === 'workflows') {
      if (this.isWorkflowPublic) {
        this.routeSub = this.router.events.subscribe(event =>
          this.urlWorkflowChanged(event)
        );
      } else {
        this.setUpWorkflow(this.communicatorService.getWorkflow());
      }
    } else if (this._toolType === 'containers') {
      if (this.isToolPublic) {
        this.routeSub = this.router.events.subscribe(event =>
          this.urlToolChanged(event)
        );
      } else {
        this.setUpTool((this.communicatorService.getTool()));
      }
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    this.workflowSubscription.unsubscribe();
    this.toolSubscription.unsubscribe();
  }

  abstract setProperties(): void;
  abstract getValidVersions(): void;

  private setUpWorkflow(workflow: any) {
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

  private setUpTool(tool: any) {
    if (tool) {
      this.tool = tool;
      if (!tool.providerUrl) {
        this.providerService.setUpProvider(tool);
      }
      this.tool = Object.assign(tool, this.tool);
      this.title = this.tool.tool_path;
      const toolRef = this.tool;
      toolRef.buildMode = this.containerService.getBuildMode(toolRef.mode);
      toolRef.buildModeTooltip = this.containerService.getBuildModeTooltip(toolRef.mode);
      this.initTool();
    }
  }

  private urlToolChanged(event) {
    if (event.url) {
      if (event.url.includes('containers')) {
        this.title = this.decodedString(event.url.replace(`/${ this._toolType }/`, ''));
        // Only get published tool if the URI is for a specific tool (/containers/quay.io%2FA2%2Fb3)
        // as opposed to just /tools or /docs etc.
        this.toolService.getPublishedToolByPath(this.encodedString(this.title), this._toolType)
        .subscribe(tool => {
          this.containerService.setTool(tool);
        }, error => {
          this.router.navigate(['../']);
        });
      }
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
