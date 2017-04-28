import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dockstore } from '../shared/dockstore.model';

@Injectable()
export class DockstoreService {

  private static readonly months = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                                    'May', 'Jun.', 'Jul.', 'Aug.',
                                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];

  constructor(private http: Http) { }

  /* Highlight Code */
  highlightCode(code): string {
    return '<pre><code class="YAML highlight">' + code + '</pre></code>';
  }

  getResponse(url: string) {
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  /* Get Fields */
  getVersion(versions, target: string) {
    for (const version of versions) {
       if (version.reference === target) {
          return version;
       }
    }
  }

  getFile(files, path: string) {
    for (const file of files) {
      if (file.path === path) {
        return file;
      }
    }
  }

  getFilePaths(files) {
    return files.map(
      (file) => { return file.path; }
    );
  }

  getVersionMap(versions) {
    const versionMap = new Map();

    for (const version of versions) {

      const descriptorToPath = new Map();
      const cwlPaths = [];
      const wdlPaths = [];

      for (const file of version.sourceFiles) {
        if (file.type === 'CWL_TEST_JSON') {
          cwlPaths.push(file);
        } else if (file.type === 'WDL_TEST_JSON') {
          wdlPaths.push(file);
        }
      }

      if (cwlPaths.length) {
        descriptorToPath.set('cwl', cwlPaths);
      }

      if (wdlPaths.length) {
         descriptorToPath.set('wdl', wdlPaths);
      }

      if (cwlPaths.length || wdlPaths.length) {
        versionMap.set(version.name, descriptorToPath);
      }

    }

    return versionMap;
  }

  /* Get Valid Versions */
  getValidVersions(versions) {
    const validVersions = [];

    for (const version of versions) {
      if (version.valid) {
        validVersions.push(version);
      }
    }

    return validVersions;
  }

  /* Set Path and Title for Details Pages */

  private isEncoded(uri: string): boolean {
    if (uri) {
      return uri !== decodeURIComponent(uri);
    }

    return null;
  }

  setPath(url: string): string {
    let path = '';

    if (!this.isEncoded(url)) {
      path = encodeURIComponent(url);
    } else {
      path = url;
    }

    return path;
  }

  setTitle(url: string) {
    let title = '';

    if (!this.isEncoded(url)) {
      title = url;
    } else {
      title = decodeURIComponent(url);
    }

    return title;
  }

  // ----------------------------------------



  /* Set Up Git URL */
  getProvider(gitUrl: string): string {
    if (gitUrl.includes('github.com')) {
      return 'GitHub';
    }

    if (gitUrl.includes('bitbucket.org')) {
      return 'Bitbucket';
    }

    if (gitUrl.includes('gitlab.com')) {
      return 'GitLab';
    }

    return null;
  }

  getProviderUrl(gitUrl: string, provider: string): string {
      if (!gitUrl) {
        return null;
      }

      const gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
      const matchRes = gitUrlRegExp.exec(gitUrl);

      if (!matchRes) {
        return null;
      }

      let providerUrl = '';

      switch (provider) {
        case 'GitHub':
          providerUrl = 'https://github.com/';
          break;
        case 'Bitbucket':
          providerUrl = 'https://bitbucket.org/';
          break;
        case 'GitLab':
          providerUrl = 'https://gitlab.com/';
          break;
        default:
          return null;
      }

      providerUrl += matchRes[1] + '/' + matchRes[2];
      return providerUrl;
  }

  setGit(tool) {
    const gitUrl = tool.gitUrl;

    tool.provider = this.getProvider(gitUrl);
    tool.providerUrl = this.getProviderUrl(gitUrl, tool.provider);

    return tool;
  }

  // ----------------------------------------

  /* Strip mailto from email field */
  stripMailTo(email: string) {
    if (email) {
      return email.replace(/^mailto:/, '');
    }

    return null;
  }

}
