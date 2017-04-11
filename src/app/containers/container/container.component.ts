import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { DockstoreService } from '../../shared/dockstore.service';
import { ListContainersService } from '../list/list.service';
import { ContainerService } from './container.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    validTags;

    tool;
    title: string;
    defaultTag;
    descriptorTypes;
    validTagsNames;

    /* Launch With Strings */
    launchParams: string;
    launchCli: string;
    launchCwl: string;
    launchConsonance: string;
    currentDescriptor: string;
    currentTagName: string;

    constructor(private router: Router,
                private dockstoreService: DockstoreService,
                private listContainersService: ListContainersService,
                private containerService: ContainerService) { }

    // one version can have cwl and wdl, another can have only cwl
    // descriptors depend on version
    onVersionChange(tagName: string): void {
      this.currentTagName = tagName;

      const tag = this.containerService.getTag(this.validTags, tagName);

      this.descriptorTypes = this.containerService.getDescriptorTypes(this.validTags, tag);

      if (this.descriptorTypes && this.descriptorTypes.length) {
          this.onDescriptorChange(this.descriptorTypes[0]);
      }
    }

    onDescriptorChange(descriptorName: string): void {
      this.currentDescriptor = descriptorName;
      this.changeStrings(this.tool.tool_path, this.currentTagName);
    }

    changeStrings(toolPath: string, tagName: string): void {
      this.launchParams = this.containerService.getParamsString(toolPath, tagName, this.currentDescriptor);
      this.launchCli = this.containerService.getCliString(toolPath, tagName, this.currentDescriptor);
      this.launchCwl = this.containerService.getCwlString(toolPath, tagName);
      this.launchConsonance = this.containerService.getConsonanceString(toolPath, tagName);
    }

    ngOnInit() {
      this.routeSub = this.router.events.subscribe(
        (event) => {
          this.urlChanged(event);
        }
      );
    }

    // navigate back if the given tool path does not exist
    private urlChanged(event) {
      let toolPath = '';

      if (event instanceof NavigationEnd) {
        const url: string = event.url.replace('/containers/', '');

        if (!this.isEncoded(url)) {
          toolPath = encodeURIComponent(url);
          this.title = url;
        } else {
          toolPath = url;
          this.title = decodeURIComponent(url);
        }

        this.containerService.getPublishedToolByPath(toolPath)
          .subscribe(
            (tool) => {
              this.tool = this.setNewProperties(tool);
              this.setUpPage(this.tool);
            },
            (err) => {
              this.router.navigate(['../']);
            }
          );
      }
    }

    private setUpPage(tool): void {
      this.validTags = this.containerService.getValidTags(tool);

      if (this.validTags.length) {
        this.setUpLaunch();
      }
    }

    private setUpLaunch(): void {
      this.setTagNames();

      let defaultVersion = this.tool.defaultVersion;

      let defaultTag;
      // if user did not specify a default version, use the latest tag
      if (!defaultVersion) {
        if (this.validTags.length) {
          const last: number = this.validTags.length - 1;

          defaultVersion = this.validTags[last].name;
          defaultTag = this.validTags[last];
        }
      } else {
        defaultTag = this.containerService.getDefaultTag(this.validTags, defaultVersion);
      }

      this.defaultTag = defaultTag;

      this.onVersionChange(defaultTag.name);
    }

    private setTagNames() {
      this.validTagsNames = this.validTags.map(
        (validTag) => {
          return validTag.name;
        }
      );
    }

    private isEncoded(uri: string): boolean {
      if (uri) {
        return uri !== decodeURIComponent(uri);
      }

      return null;
    }

    private setNewProperties(tool): any {
      tool = this.listContainersService.setProviders(tool);

      tool.timeMessage = this.dockstoreService.getTimeMessage(tool.lastBuild);
      tool.email = this.dockstoreService.stripMailTo(tool.email);
      tool.buildMode = this.containerService.getBuildMode(tool.mode);
      tool.lastBuildDate = this.dockstoreService.getDateTimeString(tool.lastBuild);
      tool.lastUpdatedDate = this.dockstoreService.getDateTimeString(tool.lastUpdated);

      return tool;
    }

    ngOnDestroy() {
      this.routeSub.unsubscribe();
    }
}
