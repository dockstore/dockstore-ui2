import { Injectable } from '@angular/core';
import { GitTagPipe } from './git-tag.pipe';

const DOCKSTORE_GITHUB_ORG = 'https://github.com/dockstore';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private gitTagPipe: GitTagPipe;

  constructor() {
    this.gitTagPipe = new GitTagPipe();
  }

  versionsToMarkdown(
    webServiceVersion: string | null,
    uiVersion: string | null,
    composeSetupVersion: string | null,
    deployVersion: string | null
  ): string {
    return `[Webservice](${this.gitHubUrl('dockstore', webServiceVersion)}) - ${webServiceVersion}

[UI](${this.gitHubUrl('dockstore-ui2', uiVersion)}) - ${uiVersion}

[Compose Setup](${this.gitHubUrl('compose_setup', composeSetupVersion)}) - ${composeSetupVersion}

[Deploy](${this.gitHubUrl('dockstore-deploy', deployVersion)}) - ${deployVersion}`;
  }

  private gitHubUrl(repo: string, commitOrVersion: string | null): string {
    return `${DOCKSTORE_GITHUB_ORG}/${repo}/${this.gitTagPipe.transform(commitOrVersion, true)}`;
  }
}
