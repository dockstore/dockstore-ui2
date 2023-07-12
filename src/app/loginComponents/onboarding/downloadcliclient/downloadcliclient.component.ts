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
### Setup Command Line Interface
------------------------------
Set up our Dockstore CLI application in order to test workflows from the command line for [local development](${Dockstore.DOCUMENTATION_URL}/launch-with/launch.html#dockstore-cli), [validate .dockstore.yml files](${Dockstore.DOCUMENTATION_URL}/advanced-topics/dockstore-cli/yaml-command-line-validator-tool.html) for registering tools and workflows,
run scripts or interact programmatically against Dockstore APIs, and [run workflows via the GA4GH WES standard](${Dockstore.DOCUMENTATION_URL}/advanced-topics/wes/wes-agc-tutorial.html) in platforms such as Amazon Genomics CLI.

#### Requirements
1. Linux/Ubuntu (Recommended - Tested on 22.04 LTS) or Mac OS X machine
2. Java 17 (Tested with OpenJDK 17, Oracle JDK may work but is untested)
3. Python3 and pip3 (Required if working with CWL, optional otherwise)
    `;

    this.textDataUbuntuLinux = `
#### Part 1 - Install dependencies
1. Install Java 17 (This example installs OpenJDK 17)
\`\`\`
sudo apt-get update -q \
&& sudo apt install -y openjdk-17-jdk
\`\`\`
2. Install Docker Engine following the instructions on [Docker's website](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository). You should have at least version 19.03.1 installed. Ensure that you install Docker Engine. Docker Desktop does not run containers natively and the Dockstore CLI is not currently compatible with Docker Desktop's use of a VM.
3. Ensure that you are able to run Docker without using sudo directly with the
[post install instructions](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user).
\`\`\`
sudo usermod -aG docker $USER
exec newgrp docker
\`\`\`

`;
    this.textDataMacOs = `
#### Part 1a - Install Java dependencies
We'll cover two ways to install Java 11.

1. The first way is to download OpenJDK 11.0.2 for Mac OS from [here](https://jdk.java.net/archive/), and execute the following commands. First, unpack the downloaded tar archive, then move the resulting JDK directory to its standard location. 
\`\`\`
tar -xf jdk-11.0.2.jdk.tar.gz
sudo mv jdk-11.0.2.jdk /Library/Java/JavaVirtualMachines/
\`\`\`
Then check the Java version:
\`\`\`
java -version
\`\`\`
Some versions of Mac OS will pop up a window saying that the program cannot be run as it is from an unidentified developer. [See this help page from Apple](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac) on how to fix this.
If the reported version is JDK 11, you've correctly installed Java! If not, check the list of the JDKs that are installed; you should see version 11:
\`\`\`
/usr/libexec/java_home -V
\`\`\`
Next, set the \`JAVA_HOME\` environment variable to the correct JDK system path
and confirm the Java version:
\`\`\`
unset JAVA_HOME
export JAVA_HOME=\`/usr/libexec/java_home -v 11\`
java -version
\`\`\`
If you are using Bash, add the above export line to your \`.bashrc\` or \`.bash_profile\` to set \`JAVA_HOME\` properly every time you invoke a shell. Newer versions of Mac OS default to using zsh instead of bash, in which case, add this line to \`.zshrc\` instead.

2. Alternatively, to install Java 11 using Homebrew, execute the following commands:
\`\`\`
brew update
brew install openjdk@11
\`\`\`
For the system Java wrappers to be able to use this JDK, symlink with the command:
\`\`\`
sudo ln -sfn $(brew --prefix)/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
\`\`\`
Next, set the \`JAVA_HOME\` environment variable to the correct JDK system path, and confirm the
Java version is correct:
\`\`\`
unset JAVA_HOME
export JAVA_HOME=\`/usr/libexec/java_home -v 11\`
java -version
\`\`\`
As with the option above, you may have to [follow these directions](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac) if your computer thinks it is from an unidentified developer.

#### Part 1b - Install Docker dependencies
Install Docker following the instructions on [Docker's website](https://docs.docker.com/docker-for-mac/install/). You should have at least version 2.0.0.3 installed.
    `;

    this.textDataInstallCLI = `
#### Part 2 - Install Dockstore CLI
1. Install the dockstore command-line program and add it to the path.
\`\`\`
mkdir -p ~/bin
curl -L -o ~/bin/dockstore ${this.downloadCli}
chmod +x ~/bin/dockstore
echo 'export PATH=~/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
\`\`\`
2. Alternatively, click here to download and configure the CLI yourself.
    `;

    this.textDataCLIConfig = `
#### Part 3 - Setup Dockstore CLI Config
1. Create the folder \`~/.dockstore\` and create a configuration file \`~/.dockstore/config\`:
\`\`\`
mkdir -p ~/.dockstore
printf "token: ${this.dsToken}\\nserver-url: ${this.dsServerURI}\\n" > ~/.dockstore/config
\`\`\`
2. Alternatively, copy this content to your config file directly.
`;
    this.textDataConfirmInstallation = `
#### Part 4 - Confirm installation
1. Run our dependencies to verify that they have been installed properly.
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

#### Part 5 - Install cwltool (Optional)
Dockstore relies on [cwltool](https://github.com/common-workflow-language/cwltool) -a reference implementation of CWL- for local execution of tools and workflows described with CWL.
You'll need to have Python 3 and [pip3](https://pip.pypa.io/en/latest/installing/) to be installed on your machine.

**Note:** cwltool must be available on your PATH.

You can install the version of cwltool that we've tested for use with Dockstore using the following commands:
1. Run this to verify that pip has been installed \`pip3 --version\`
2. Run these commands to install cwltool
\`\`\`
curl -o requirements.txt "${this.dsServerURI}/metadata/runner_dependencies?client_version=${this.dockstoreVersion}&python_version=3"
pip3 install -r requirements.txt
\`\`\`
3. Verify using \`pip3 list\` that the installed pip packages match the ones specified in the downloaded requirements.txt. Confirm cwltool installation by checking the version.
\`\`\`
$ cwltool --version
/usr/local/bin/cwltool ${this.cwltoolVersion}
\`\`\`

Although Dockstore has only been tested with the above cwltool version, if you have issues installing cwltool please try running \`pip3 install cwltool\`. This will install the latest released version from PyPi that is compatible with your Python version.

#### Part 6 - Install Nextflow (Optional)
The Dockstore CLI does not run Nextflow workflows. Users can run them directly by using the Nextflow command line tool. For installation instructions, follow [Nextflow's documentation](https://github.com/nextflow-io/nextflow#download-the-package)
`;
  }
}
