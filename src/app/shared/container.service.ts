import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

import { Dockstore } from './dockstore.model';
import { DockstoreService } from './dockstore.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ContainerService {

  private static readonly descriptorWdl = ' --descriptor wdl';
  private toolSource = new BehaviorSubject<any>(null);
  tool$ = this.toolSource.asObservable(); // This is the selected tool
  tools = new BehaviorSubject<any>(null); // This contains the list of unsorted tools
  nsContainers: BehaviorSubject<any> = new BehaviorSubject(null); // This contains the list of sorted tool stubs
  constructor(private dockstoreService: DockstoreService) { }
  setTool(tool: any) {
    this.toolSource.next(tool);
  }

  setTools(tools: any) {
    this.tools.next(tools);
  }

  addToTools(tools: any, tool: any) {
    tools.push(tool);
    this.tools.next(tools);
  }

  setNsContainers(tools: any) {
    this.nsContainers.next(tools);
  }

  getDescriptors(versions, version) {
    if (versions.length && version) {

      const typesAvailable = new Array();

      for (const file of version.sourceFiles) {
        const type = file.type;

        if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes('cwl')) {
          typesAvailable.push('cwl');

        } else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes('wdl')) {
          typesAvailable.push('wdl');
        }
      }

      return typesAvailable;
    }
  }

  getBuildMode(mode: string) {
    switch (mode) {
      case 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS':
        return 'Fully-Automated';
      case 'AUTO_DETECT_QUAY_TAGS_WITH_MIXED':
        return 'Partially-Automated';
      case 'MANUAL_IMAGE_PATH':
        return 'Manual';
      default:
        return 'Unknown';
    }
  }

  getBuildModeTooltip(mode: string) {
    switch (mode) {
      case 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS':
        return 'Fully-Automated: All versions are automated builds';
      case 'AUTO_DETECT_QUAY_TAGS_WITH_MIXED':
        return 'Partially-Automated: At least one version is an automated build';
      case 'MANUAL_IMAGE_PATH':
        return 'Manual: No versions are automated builds';
      default:
        return 'Unknown: Build information not known';
    }
  }

}
