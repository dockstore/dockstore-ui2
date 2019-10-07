/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from './models/ExtendedWorkflow';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBitbucket, faGithub, faGitlab } from '@fortawesome/free-brands-svg-icons';
import { faDockstore, faWhale } from './custom-icons';

export class ProviderService {
  /* set up project provider */
  setUpProvider(tool: ExtendedDockstoreTool | ExtendedWorkflow): ExtendedDockstoreTool | ExtendedWorkflow {
    const gitUrl = tool.gitUrl;

    tool.provider = this.getProvider(gitUrl);
    tool.providerUrl = this.getProviderUrl(gitUrl, tool.provider);
    tool.providerIcon = this.getProviderIcon(tool.providerUrl);
    return tool;
  }

  private getProviderIcon(providerUrl: string): IconDefinition {
    if (!providerUrl) {
      return null;
    }
    if (providerUrl.startsWith('https://github.com/')) {
      return faGithub;
    }
    if (providerUrl.startsWith('https://bitbucket.org/')) {
      return faBitbucket;
    }
    if (providerUrl.startsWith('https://gitlab.com/')) {
      return faGitlab;
    }
    if (providerUrl.startsWith('https://dockstore.org')) {
      return faDockstore;
    } else {
      return faWhale;
    }
  }

  // TODO: Without an anchor, this looks fragile (github repo that included the string " bitbucket.org" in its name)
  private getProvider(gitUrl: string): string {
    if (gitUrl.startsWith('git@github.com')) {
      return 'GitHub';
    }

    if (gitUrl.startsWith('git@bitbucket.org')) {
      return 'Bitbucket';
    }

    if (gitUrl.startsWith('git@gitlab.com')) {
      return 'GitLab';
    }

    if (gitUrl.startsWith('git@dockstore.org')) {
      return 'Dockstore';
    }

    return null;
  }

  private getProviderUrl(gitUrl: string, provider: string): string {
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
      case 'Dockstore':
        providerUrl = 'https://dockstore.org/';
        break;
      default:
        return null;
    }

    providerUrl += matchRes[1] + '/' + matchRes[2];
    return providerUrl;
  }
}
