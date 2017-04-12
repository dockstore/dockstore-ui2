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
  validVersionNames;

  /* underlying objects for options */
  validVersions;

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

            this.setUpVersions();
            this.setUpLaunch();
          },
          (err) => {
            this.router.navigate(['../']);
          }
        );
    }
  }

  private setUpVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
    console.log(this.validVersions);

    this.validVersionNames = this.validVersions.map(
      (version) => { return version.reference; }
    );

    if (this.workflow.defaultVersion) {
      this.defaultVersion = this.workflow.defaultVersion;
    } else {
      this.defaultVersion = this.validVersionNames[0];
    }
    this.currentVersion = this.defaultVersion;
  }

  private setUpLaunch() {
    const path = this.workflow.path;

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
