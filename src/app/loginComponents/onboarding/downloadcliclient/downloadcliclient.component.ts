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
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { SnackbarDirective } from '../../../shared/snackbar.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf, NgClass } from '@angular/common';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-downloadcliclient',
  templateUrl: './downloadcliclient.component.html',
  styleUrls: ['./downloadcliclient.component.scss'],
  standalone: true,
  imports: [
    MarkdownModule,
    MatLegacyTabsModule,
    NgIf,
    MatLegacyButtonModule,
    MatIconModule,
    SnackbarDirective,
    NgClass,
    ExtendedModule,
    ClipboardModule,
  ],
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
2. Java 17 (Tested with OpenJDK 17, Oracle JDK may work but is untested)
3. Python3 and pip3 (Required if working with CWL, optional otherwise)
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
There are two ways to install Java on Mac OS.

##### Option A: Install Java manually
You can OpenJDK 17.0.2 for Mac OS from [here](https://jdk.java.net/archive/). If your Mac uses Apple Silicon, you need to download and unpack the Mac/AArch64 version:
\`\`\`
tar -xf openjdk-17.0.2_macos-aarch64_bin.tar.gz
\`\`\`
If your Mac uses Intel hardware, you need the Mac/x64 version instead:
\`\`\`
tar -xf openjdk-17.0.2_macos-x64_bin.tar.gz
\`\`\`
Move the resulting JDK directory to its standard location:
\`\`\`
sudo mv jdk-17.0.2.jdk /Library/Java/JavaVirtualMachines/
\`\`\`
Then check the Java version:
\`\`\`
java -version
\`\`\`
Some versions of Mac OS will pop up a window saying that the program cannot be run as it is from an unidentified developer. [See this help page from Apple](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac) on how to fix this.
If the reported version is JDK 17, you've correctly installed Java! If not, check the list of the JDKs that are installed; you should see version 17:
\`\`\`
/usr/libexec/java_home -V
\`\`\`
Next, set the \`JAVA_HOME\` environment variable to the correct JDK system path
and confirm the Java version:
\`\`\`
unset JAVA_HOME
export JAVA_HOME=\`/usr/libexec/java_home -v 17\`
java -version
\`\`\`
If you are using Bash, add the above export line to your \`.bashrc\` or \`.bash_profile\` to set \`JAVA_HOME\` properly every time you invoke a shell. Newer versions of Mac OS default to using zsh instead of bash, in which case, add this line to \`.zshrc\` instead.

##### Option B: Install Java with Homebrew
2. Alternatively, to install Java 17 using Homebrew, execute the following commands:
\`\`\`
brew update
brew install openjdk@17
\`\`\`
For the system Java wrappers to be able to use this JDK, symlink with the command:
\`\`\`
sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
\`\`\`
Next, set the \`JAVA_HOME\` environment variable to the correct JDK system path, and confirm the
Java version is correct:
\`\`\`
unset JAVA_HOME
export JAVA_HOME=\`/usr/libexec/java_home -v 17\`
java -version
\`\`\`
As with option A, you may have to [follow these directions](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac) if your computer gives you a warning about an unidentified developer.

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
You'll need to have Python 3 and [pip3](https://pip.pypa.io/en/latest/installing/) to be installed on your machine.

**Note:** cwltool must be available on your PATH for the Dockstore CLI to find it.

You can install the version of cwltool that we've tested for use with Dockstore using the following commands:
1. Install cwltool
\`\`\`
curl -o requirements.txt "${this.dsServerURI}/metadata/runner_dependencies?client_version=${this.dockstoreVersion}&python_version=3"
pip3 install -r requirements.txt
\`\`\`
2. Verify using \`pip3 list\` that the installed pip packages match the ones specified in the downloaded requirements.txt. Confirm cwltool installation by checking the version.
\`\`\`
$ cwltool --version
/usr/local/bin/cwltool ${this.cwltoolVersion}
\`\`\`

Although Dockstore has only been tested with the above cwltool version, if you have issues installing cwltool please try running \`pip3 install cwltool\`. This will install the latest released version from PyPi that is compatible with your Python version.

#### Part 7 - Install Nextflow (Optional)
The Dockstore CLI does not run Nextflow workflows. Users can run them directly by using the Nextflow command line tool. For installation instructions, follow [Nextflow's documentation](https://github.com/nextflow-io/nextflow#download-the-package)
`;
  }
}
