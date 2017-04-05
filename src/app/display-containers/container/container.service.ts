import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';

@Injectable()
export class ContainerService {

  private static readonly descriptorWdl = ' --descriptor wdl';
  private static readonly months = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                                    'May', 'Jun.', 'Jul.', 'Aug.',
                                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];

  constructor(private dockstoreService: DockstoreService) { }

  getValidTags(tool) {
    const validTags = [];

    for (const tag of tool.tags) {
      if (tag.valid) {
        validTags.push(tag);
      }
    }

    return validTags;
  }

  getDefaultTag(validTags, defaultVersion) {
    if (validTags.length) {
      for (const tag of validTags) {
        if (tag.name === defaultVersion) {
          return tag;
        }
      }
    }

    return null;
  }

  getDescriptorTypes(validTags, defaultTag, defaultVersion) {
    if (validTags.length && defaultTag && defaultVersion) {
      const typesAvailable = new Array();

      for (const file of defaultTag.sourceFiles) {
        const type = file.type;

        if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes('cwl')) {
          typesAvailable.push('cwl');

        } else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes('wdl')) {
          typesAvailable.push('wdl');
        }
      }

      return typesAvailable;
    }
    return null;
  }

  getParamsString(toolPath: string, tagName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = ContainerService.descriptorWdl;
    }

    return '$ dockstore tool convert entry2json' + descriptor + ' --entry ' + toolPath + ':' + tagName + ` > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(toolPath: string, tagName: string, currentDescriptor: string) {
    let descriptor = '';

    if (currentDescriptor === 'wdl') {
      descriptor = ContainerService.descriptorWdl;
    }

    return '$ dockstore tool launch --entry ' + toolPath + ':' + tagName + ' --json Dockstore.json' + descriptor;
  }

  getCwlString(toolPath: string, tagName: string) {
    return '$ cwltool --non-strict https://www.dockstore.org:8443/api/ga4gh/v1/tools/' + encodeURIComponent(toolPath) +
           '/versions/' + encodeURIComponent(tagName) + '/plain-CWL/descriptor Dockstore.json';
  }

  getConsonanceString(toolPath: string, tagName: string) {
    return '$ consonance run --tool-dockstore-id ' + toolPath + ':' + tagName +
           ' --run-descriptor Dockstore.json --flavour \<AWS instance-type\>';
  }

  getPublishedToolByPath(path: string) {
    const publishedToolUrl = Dockstore.API_URI + '/containers/path/tool/' + path + '/published';
    return this.dockstoreService.getResponse(publishedToolUrl);
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

  getDateTimeString(timestamp: number, dateOnly = false): string {
    const date = new Date(timestamp);
    let dateString = ContainerService.months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();

    if (!dateOnly) {
      dateString += ' at ' + date.toLocaleTimeString();
    }

    return dateString;
  }

  getDate(timestamp) {
    return this.getDateTimeString(timestamp);
  }

  getSizeString(size: number) {
    let sizeStr = '';

    if (size) {
      const exp = Math.log(size) / Math.log(2);
      if (exp < 10) {
        sizeStr = size.toFixed(2) + ' bytes';
      } else if (exp < 20) {
        sizeStr = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
      } else if (exp < 30) {
        sizeStr = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
      } else if (exp < 40) {
        sizeStr = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
      }
    }

    return sizeStr;
  }
}
