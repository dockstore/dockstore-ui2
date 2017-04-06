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

    private setUpLaunch(): void {
      const validTags = this.containerService.getValidTags(this.tool);
      let defaultVersion = this.tool.defaultVersion;
      let defaultTag = this.containerService.getDefaultTag(validTags, defaultVersion);

      if (!defaultVersion) {
        if (validTags.length) {
          const last: number = validTags.length - 1;

          defaultVersion = validTags[last].name;
          defaultTag = validTags[last];
        }
      }

      const descriptorTypes = this.containerService.getDescriptorTypes(validTags, defaultTag, defaultVersion);

      this.validTagsNames = validTags.map(
        (validTag) => {
          return validTag.name;
        }
      );

      this.defaultTag = defaultTag;
      this.descriptorTypes = descriptorTypes;

      if (descriptorTypes) {
        if (descriptorTypes.length) {
          this.currentDescriptor = descriptorTypes[0];
        }

        this.onVersionChange(this.defaultTag.name);
      }
    }

    private setNewProperties(tool): any {
      tool = this.listContainersService.setProviders(tool);

      tool.timeMessage = this.dockstoreService.getTimeMessage(tool.lastBuild);
      tool.email = this.dockstoreService.stripMailTo(tool.email);
      tool.buildMode = this.containerService.getBuildMode(tool.mode);
      tool.lastBuildDate = this.containerService.getDateTimeString(tool.lastBuild);
      tool.lastUpdatedDate = this.containerService.getDateTimeString(tool.lastUpdated);

      return tool;
    }

    onDescriptorChange(descriptorName): void {
      this.currentDescriptor = descriptorName;

      this.onVersionChange(this.currentTagName);
    }

    onVersionChange(tagName): void {
      const toolPath: string = this.tool.tool_path;
      this.currentTagName = tagName;

      this.launchParams = this.containerService.getParamsString(toolPath, tagName, this.currentDescriptor);
      this.launchCli = this.containerService.getCliString(toolPath, tagName, this.currentDescriptor);
      this.launchCwl = this.containerService.getCwlString(toolPath, tagName);
      this.launchConsonance = this.containerService.getConsonanceString(toolPath, tagName);
    }

    private isEncoded(uri: string): boolean {
      if (uri) {
        return uri !== decodeURIComponent(uri);
      }

      return null;
    }

    ngOnInit() {
      let toolPath = '';
      this.routeSub = this.router.events.subscribe(
        (event) => {

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
                  this.setUpLaunch();
                },
                (err) => {
                  this.router.navigate(['../']);
                }
              );
          }
        }
      );
    }

    ngOnDestroy() {
      this.routeSub.unsubscribe();
    }
}
