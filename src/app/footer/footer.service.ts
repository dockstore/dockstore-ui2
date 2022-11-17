import { Injectable } from '@angular/core';
import { GitTagPipe } from './git-tag.pipe';

const DOCKSTORE_GITHUB_ORG = 'https://github.com/dockstore';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private gitTagPipe: GitTagPipe;

  constructor() {
    this.gitTagPipe = new GitTagPipe();
  }

  versionsToMarkdown(
    domain: string | null,
    webServiceVersion: string | null,
    uiVersion: string | null,
    composeSetupVersion: string | null,
    deployVersion: string | null,
    cwlParsingLambdaVersion: string | null,
    wdlParsingLambdaVersion: string | null,
    nextflowParsingLambdaVersion: string | null,
    galaxyParsingLambdaVersion: string | null,
    checkUrlLambdaVersion: string | null
  ): string {
    let baseBuildInfo = `[Domain] - ${domain}

[Webservice](${this.gitHubUrl('dockstore', webServiceVersion)}) - ${webServiceVersion}

[UI](${this.gitHubUrl('dockstore-ui2', uiVersion)}) - ${uiVersion}`;
    if (composeSetupVersion) {
      baseBuildInfo =
        baseBuildInfo + `\n\n[Compose Setup](${this.gitHubUrl('compose_setup', composeSetupVersion)}) - ${composeSetupVersion}`;
    }
    if (deployVersion) {
      baseBuildInfo = baseBuildInfo + `\n\n[Deploy](${this.gitHubUrl('dockstore-deploy', deployVersion)}) - ${deployVersion}`;
    }

    if (cwlParsingLambdaVersion) {
      baseBuildInfo = baseBuildInfo + `\n\ncwlParsingLambdaVersion: ${cwlParsingLambdaVersion}`;
    }

    if (wdlParsingLambdaVersion) {
      baseBuildInfo = baseBuildInfo + `\n\nwdlParsingLambdaVersion: ${wdlParsingLambdaVersion}`;
    }

    if (nextflowParsingLambdaVersion) {
      baseBuildInfo = baseBuildInfo + `\n\nnextflowParsingLambdaVersion: ${nextflowParsingLambdaVersion}`;
    }

    if (galaxyParsingLambdaVersion) {
      baseBuildInfo = baseBuildInfo + `\n\ngalaxyParsingLambdaVersion: ${galaxyParsingLambdaVersion}`;
    }

    if (checkUrlLambdaVersion) {
      baseBuildInfo = baseBuildInfo + `\n\ncheckUrlLambdaVersion: ${checkUrlLambdaVersion}`;
    }
    return baseBuildInfo;
  }

  private gitHubUrl(repo: string, commitOrVersion: string | null): string {
    return `${DOCKSTORE_GITHUB_ORG}/${repo}/${this.gitTagPipe.transform(commitOrVersion, true)}`;
  }
}
