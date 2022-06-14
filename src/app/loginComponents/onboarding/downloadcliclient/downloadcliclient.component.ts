/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { finalize } from 'rxjs/operators';
import { Dockstore } from '../../../shared/dockstore.model';
import { MetadataService } from '../../../shared/swagger';
import { GA4GHService } from './../../../shared/swagger/api/gA4GH.service';
import { Metadata } from './../../../shared/swagger/model/metadata';

@Component({
  selector: 'app-downloadcliclient',
  templateUrl: './downloadcliclient.component.html',
  styleUrls: ['./downloadcliclient.component.scss'],
})
export class DownloadCLIClientComponent implements OnInit {
  public downloadCli = 'dummy-start-value';
  public dockstoreVersion = 'dummy-start-value';
  public dockstoreCliVersion = 'dummy-start-value';
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
  constructor(private authService: AuthService, private metadataService: MetadataService, private gA4GHService: GA4GHService) {}

  ngOnInit() {
    if (this.authService.getToken()) {
      this.dsToken = this.authService.getToken();
    }
    this.dsServerURI = Dockstore.API_URI;
    this.isCopied2 = false;
    let apiVersion = 'unreachable';
    this.gA4GHService.metadataGet().subscribe(
      (resultFromApi: Metadata) => {
        apiVersion = resultFromApi.version;
        this.dockstoreVersion = `${apiVersion}`;
        this.metadataService.getCliVersion().subscribe(
          (json: any) => {
            if (json) {
              this.dockstoreCliVersion = json;
            }
            this.downloadCli = `https://github.com/dockstore/dockstore-cli/releases/download/${this.dockstoreCliVersion}/dockstore`;
            this.metadataService
              .getRunnerDependencies(apiVersion, '3', 'cwltool', 'json')
              .pipe(finalize(() => this.generateMarkdown()))
              .subscribe(
                (json: any) => {
                  if (json) {
                    this.cwltoolVersion = json.cwltool;
                  }
                },
                (err) => {
                  console.log('Unable to retrieve requirements.txt file.');
                }
              );
          },
          (err) => {
            console.log('Unable to retrieve Dockstore CLI version.');
          }
        );
      },
      (error) => {
        this.generateMarkdown();
      }
    );
  }
  generateMarkdown(): void {
    this.textDataRequirements = `
### Setup Command Line Interface
------------------------------
Setup our Dockstore CLI application to start launching workflows from the command line.

#### Requirements
1. Linux/Ubuntu (Recommended - Tested on 18.04.3 LTS) or Mac OS X machine
2. Java 11 (Tested with OpenJDK 11, Oracle JDK may work but is untested)
3. Python3 and pip3 (Required if working with CWL, optional otherwise)
    `;

    this.textDataUbuntuLinux = `
#### Part 1 - Install dependencies
1. Install Java 11 (This example installs OpenJDK 11)
\`\`\`
sudo add-apt-repository ppa:openjdk-r/ppa \
&& sudo apt-get update -q \
&& sudo apt install -y openjdk-11-jdk
\`\`\`
2. Install Docker following the instructions on [Docker's website](https://docs.docker.com/install/linux/docker-ce/ubuntu/). You should have at least version 19.03.1 installed.
Ensure that you are able to run Docker without using sudo directly with the
[post install instructions](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user).
\`\`\`
sudo usermod -aG docker $USER
exec newgrp docker
\`\`\`

`;
    this.textDataMacOs = `
#### Part 1a - Install Java dependencies
We'll cover two ways to install Java 11.

1. The first way is to download OpenJDK for Mac OS from [here](https://jdk.java.net/archive/), and execute the following commands.  First, unpack the downloaded tar archive, then move the resulting JDK directory to its standard location. Then check the Java version:
\`\`\`
sudo mv jdk-11.0.2.jdk /Library/Java/JavaVirtualMachines/
java -version
\`\`\`
If the reported version is JDK 11, you've correctly installed Java!  If not, check the list of the JDKs that are installed; you should see version 11:
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
Add the above export line to your \`.bashrc\` or \`.bash_profile\` to set \`JAVA_HOME\` properly every time you invoke a shell.

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
openjdk version "11.0.4" 2019-07-16
OpenJDK Runtime Environment (build 11.0.4+11-post-Ubuntu-1ubuntu218.04.3)
OpenJDK 64-Bit Server VM (build 11.0.4+11-post-Ubuntu-1ubuntu218.04.3, mixed mode, sharing)
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

#### Part 6 - Install Nextflow (Optional)
The Dockstore CLI does not run Nextflow workflows. Users can run them directly by using the Nextflow command line tool. For installation instructions, follow [Nextflow's documentation](https://github.com/nextflow-io/nextflow#download-the-package)
`;
  }
}
