import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Tag, WorkflowVersion } from './swagger';

@Injectable()
export class UrlResolverService {
  constructor(private router: Router) {}

  /**
   * Gets the updated path that has the tab and versioninformation
   *
   * @param {string} entryPath  Path of the entry ('quay.io/pancancer/pcawg-dkfz-workflow')
   * @param {string} myEntryString  Either 'my-tools', 'my-workflows', or 'my-services'. 'my-containers' is deprecated
   * @param {string} entryString  Either 'tools', 'workflows', or 'services'. 'containers' is deprecated
   * @param {string} currentUrl  '/tools/quay.io/pancancer/pcawg-dkfz-workflow:2.2.0?tab=info'
   * @param {(WorkflowVersion | Tag | null)} selectedVersion  The version that's currently selected
   * @param {string} tabName  Name of the currently selected tab ('info', 'launch')
   * @returns {string}  The path that reflects the current stepState
   * @memberof UrlResolverService
   */
  getPath(
    entryPath: string,
    myEntryString: string,
    entryString: string,
    currentUrl: string,
    selectedVersion: WorkflowVersion | Tag | null,
    tabName: string
  ): string {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('tab', tabName);
    const baseRoute = currentUrl.includes(myEntryString) ? myEntryString : entryString;
    const fullEntryPath = selectedVersion !== null ? entryPath + ':' + selectedVersion.name : entryPath;
    const newUrl = `/${[baseRoute, fullEntryPath].join('/')}?${queryParams.toString()}`;
    return newUrl;
  }

  public getEntryPathFromUrl(): string {
    const url = this.router.url;
    let title = this.decodedString(url.replace(`/my-workflows/`, ''));
    title = this.decodedString(title.replace(`/my-tools/`, ''));
    title = this.decodedString(title.replace(`/my-services/`, ''));
    title = this.decodedString(title.replace(`/services/`, ''));
    title = this.decodedString(title.replace(`/workflows/`, ''));
    title = this.decodedString(title.replace(`/tools/`, ''));
    title = this.decodedString(title.replace(`/containers/`, ''));

    // Remove Query params from title
    const splitTitleByQueryParams = title.split('?');
    title = splitTitleByQueryParams[0];

    // Get version from path if it exists
    const splitTitle = title.split(':');
    if (splitTitle.length === 2) {
      const urlVersion = splitTitle[1];
      title = title.replace(':' + urlVersion, '');
    }
    return title;
  }

  public getVersionFromURL(): string {
    const url = this.router.url;
    // Remove query params
    const splitUrlByQueryParams = url.split('?');
    const path = splitUrlByQueryParams[0];

    const splitPathByVersion = path.split(':');
    if (splitPathByVersion.length === 2) {
      return splitPathByVersion[1];
    } else {
      return null;
    }
  }

  private isEncoded(uri: string): boolean {
    if (uri) {
      return uri !== decodeURIComponent(uri);
    }
    return null;
  }

  private decodedString(url: string): string {
    if (this.isEncoded(url)) {
      return decodeURIComponent(url);
    }
    return url;
  }
}
