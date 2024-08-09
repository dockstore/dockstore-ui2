/* eslint-disable max-len */
import { Component, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Dockstore } from '../../../shared/dockstore.model';
import { MetadataService, TRSService } from '../../../shared/openapi';
import { ServiceInfoService } from '../../../service-info/service-info.service';
import { AlertService } from './../../../shared/alert/state/alert.service';
import { forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Base } from 'app/shared/base';

@Component({
  selector: 'app-downloadcliclient',
  templateUrl: './downloadcliclient.component.html',
  styleUrls: ['./downloadcliclient.component.scss'],
})
export class DownloadCLIClientComponent extends Base implements OnInit {
  public downloadCli = 'dummy-start-value';
  public dockstoreVersion = 'dummy-start-value';
  public dsToken = 'dummy-token';
  public dsServerURI: any;
  public isCopied2: boolean;
  public textDataRequirements = '';
  public textDataMacOs = '';
  public textDataUbuntuLinux = '';
  public textDataCLIConfig = '';
  public textDataConfirmInstallation = '';
  public textDataInstallCLI = '';
  private cwltoolVersion = '';
  constructor(
    private authService: AuthService,
    private metadataService: MetadataService,
    private serviceInfoService: ServiceInfoService,
    private alertService: AlertService
  ) {
    super();
  }

  onClipboardCopy(copied: boolean) {
    this.isCopied2 = copied;
  }

  ngOnInit() {
    if (this.authService.getToken()) {
      this.dsToken = this.authService.getToken();
    }
    this.dsServerURI = Dockstore.API_URI;
    this.isCopied2 = false;
    let apiVersion = 'unreachable';
    this.alertService.start('Fetching service-info');
    this.serviceInfoService
      .getServiceInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (serviceInfo: TRSService) => {
          apiVersion = serviceInfo.version;
          this.dockstoreVersion = `${apiVersion}`;

          // forkJoin returns an array of values, here we map those values to an object
          forkJoin([this.metadataService.getCliVersion(), this.metadataService.getRunnerDependencies(apiVersion, '3', 'cwltool', 'json')])
            .pipe(finalize(() => this.generateMarkdown()))
            .subscribe(
              ([cliInfo, dependencies]) => {
                this.downloadCli = cliInfo.cliLatestDockstoreScriptDownloadUrl;
                this.cwltoolVersion = JSON.parse(JSON.stringify(dependencies)).cwltool;
                this.alertService.simpleSuccess();
              },
              (forkError) => {
                this.alertService.detailedError(forkError);
              }
            );
        },
        (serviceInfoError) => {
          this.generateMarkdown();
          this.alertService.detailedError(serviceInfoError);
        }
      );
  }
  generateMarkdown(): void {
    this.textDataRequirements = `
### Set Up Command Line Interface
------------------------------
You can search for workflows or launch them with our cloud partners using the Dockstore website, but we also provide a command-line tool to make developing and launching workflows more convenient. Set up our Dockstore CLI application in order to test workflows from the command line for [local development](${Dockstore.DOCUMENTATION_URL}/launch-with/launch.html#dockstore-cli), [validate .dockstore.yml files](${Dockstore.DOCUMENTATION_URL}/advanced-topics/dockstore-cli/yaml-command-line-validator-tool.html) for registering tools and workflows,
run scripts or interact programmatically against Dockstore APIs, and [run workflows via the GA4GH WES standard](${Dockstore.DOCUMENTATION_URL}/advanced-topics/wes/cli-wes-tutorial.html) in platforms such as Amazon Genomics CLI.

#### Requirements
1. Linux/Ubuntu (Recommended - Tested on 22.04 LTS) or Mac OS X machine
2. Java 17 (Tested with OpenJDK 17 and Eclipse Temurin JDK 17; Oracle JDK may work but is untested)
3. Python3 and pipx (Required if working with CWL, optional otherwise)
    `;

    this.textDataUbuntuLinux = `
#### Part 1 - Install Java
Install Java 17 (This example installs OpenJDK 17)
\`\`\`
sudo apt-get update -q \
&& sudo apt install -y openjdk-17-jdk
\`\`\`

#### Part 2 - Install Docker
Install Docker Engine following the instructions on [Docker's website](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository). You should have at least version 19.03.1 installed. Ensure that you install Docker Engine. The Ubuntu version of Docker Desktop does not run containers natively, so it is not compatible with the Dockstore CLI.

Ensure that you are able to run Docker without using sudo directly with the
[post install instructions](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user).
\`\`\`
sudo usermod -aG docker $USER
exec newgrp docker
\`\`\`

`;
    this.textDataMacOs = `
#### Part 1 - Install Java
There are several ways to install Java on Mac OS. Here are some examples:

* Using a package manager
  * [Homebrew](https://brew.sh/)
  * [SDKMAN!](https://sdkman.io/)
* Using a GUI installer with a .pkg file
  * [Temurin](https://adoptium.net/temurin/)
  * [Corretto](https://docs.aws.amazon.com/corretto/)
* Downloading an archive directly
  * [OpenJDK](https://openjdk.org/install/)

After you've installed Java, make sure the version is correct by running \`java -version\` in the terminal, and verifying the major version is 17 or greater.

#### Part 2 - Install Docker
Install Docker following the instructions on [Docker's website](https://docs.docker.com/docker-for-mac/install/). You should have at least version 4.3.0 installed. Make sure to install the correct version for your hardware.
    `;

    this.textDataInstallCLI = `
#### Part 3 - Install Dockstore CLI
Install the dockstore command-line program and add it to the path. (If you are using zsh, change the last two lines to use ~/.zshrc instead of ~/.bashrc)
\`\`\`
mkdir -p ~/bin
curl -L -o ~/bin/dockstore ${this.downloadCli}
chmod +x ~/bin/dockstore
echo 'export PATH=~/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
\`\`\`
As an alternative, click here to download and configure the CLI manually.
    `;

    this.textDataCLIConfig = `
#### Part 4 - Set up Dockstore CLI Config
Create the folder \`~/.dockstore\` and create a configuration file \`~/.dockstore/config\`:
\`\`\`
mkdir -p ~/.dockstore
printf "token: ${this.dsToken}\\nserver-url: ${this.dsServerURI}\\n" > ~/.dockstore/config
\`\`\`
Alternatively, copy this content to your config file directly.
`;
    this.textDataConfirmInstallation = `
#### Part 5 - Confirm installation
Run our dependencies to verify that they have been installed properly. (Note that the precise version of openjdk may vary depending on how you installed it.)
\`\`\`
$ java -version
openjdk 17.0.5 2022-10-18
OpenJDK Runtime Environment (build 17.0.5+8-Ubuntu-2ubuntu122.04)
OpenJDK 64-Bit Server VM (build 17.0.5+8-Ubuntu-2ubuntu122.04, mixed mode, sharing)
$ dockstore --version
Dockstore version ${this.dockstoreVersion}
$ docker run hello-world
Hello from Docker!
...
\`\`\`

At this point, you now have the Dockstore CLI set up for interacting with the Dockstore website, as well as executing WDL workflows. If you wish to run CWL or Nextflow workflows, you will need two more dependencies.

#### Part 6 - Install cwltool (Optional)
Dockstore relies on [cwltool](https://github.com/common-workflow-language/cwltool) - a reference implementation of CWL - for local execution of tools and workflows described with CWL.
You'll need to have Python 3 and [pipx](https://pipx.pypa.io/latest/installation/) to be installed on your machine.

**Note:** cwltool must be available on your PATH for the Dockstore CLI to find it.

You can install the version of cwltool that we've tested for use with Dockstore using the following commands:
1. Install cwltool
\`\`\`
curl -o requirements.txt "${this.dsServerURI}/metadata/runner_dependencies?client_version=${this.dockstoreVersion}&python_version=3"
pipx install cwltool==${this.cwltoolVersion}
pipx inject cwltool -r requirements.txt --force
\`\`\`
2. Verify using \`pipx list\` that the installed pip packages match the ones specified in the downloaded requirements.txt. Confirm cwltool installation by checking the version.
\`\`\`
$ cwltool --version
/usr/local/bin/cwltool ${this.cwltoolVersion}
\`\`\`

Although Dockstore has only been tested with the above cwltool version, if you have issues installing cwltool please try running \`pipx install cwltool\`. This will install the latest released version from PyPi that is compatible with your Python version.

#### Part 7 - Install Nextflow (Optional)
The Dockstore CLI does not run Nextflow workflows. Users can run them directly by using the Nextflow command line tool. For installation instructions, follow [Nextflow's documentation](https://github.com/nextflow-io/nextflow#download-the-package)
`;
  }
}
