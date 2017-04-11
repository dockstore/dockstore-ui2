import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { DockstoreService } from '../../shared/dockstore.service';
import { WorkflowService } from './workflow.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;

  title;
  workflow;

  /* Launch Strings */
  launchParams;
  launchCwl;
  launchCli;

  /* options */
  workflowVersions;

  /* default */
  defaultVersion;

  /* current */
  currentVersion;

  constructor(private router: Router,
              private dockstoreService: DockstoreService,
              private workflowService: WorkflowService) { }

  ngOnInit() {
    this.routeSub = this.router.events.subscribe(
      (event) => {
        this.urlChanged(event);
      }
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private urlChanged(event) {
    if (event instanceof NavigationEnd) {
      const url: string = event.url.replace('/workflows/', '');

      this.title = this.dockstoreService.setTitle(url);
      const workflowPath = this.dockstoreService.setPath(url);

      this.workflowService.getPublishedWorkflowByPath(workflowPath)
        .subscribe(
          (workflow) => {
            workflow = this.dockstoreService.setGit(workflow);
            workflow.timeMessage = this.dockstoreService.getTimeMessage(workflow.lastUpdated);
            this.workflow = workflow;

            this.setWorkflowVersions();
            this.setUpLaunch();
          },
          (err) => {
            this.router.navigate(['../']);
          }
        );
    }
  }

  private setWorkflowVersions() {
    this.workflowVersions = this.workflow.workflowVersions.map(
      (version) => { return version.reference; }
    );

    let defaultVersion = this.workflow.defaultVersion;

    if (defaultVersion) {
      this.currentVersion = defaultVersion;
    } else {
      this.currentVersion = this.workflowVersions[0];
    }
  }

  private setUpLaunch() {
    let path = this.workflow.path;

    this.launchParams = this.workflowService.getParamsString(path, this.currentVersion);
    this.launchCli = this.workflowService.getCliString(path, this.currentVersion);
    if (this.workflow.descriptorType === 'cwl') {
      this.launchCwl = this.workflowService.getCwlString(path, this.currentVersion);
    }
  }

  onVersionChange(version: string) {
    this.currentVersion = version;
    this.setUpLaunch();
  }
}
