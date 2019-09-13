// tslint:disable:max-line-length
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
  styleUrls: ['./downloadcliclient.component.scss']
})
export class DownloadCLIClientComponent implements OnInit {
  public downloadCli = 'dummy-start-value';
  public dockstoreVersion = 'dummy-start-value';
  public dsToken = 'dummy-token';
  public dsServerURI: any;
  public isCopied2: boolean;
  public textData1 = '';
  public textData2 = '';
  public textData3 = '';
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
        this.downloadCli = `https://github.com/ga4gh/dockstore/releases/download/${apiVersion}/dockstore`;
        this.metadataService
          .getRunnerDependencies(apiVersion, '2', 'cwltool', 'json')
          .pipe(finalize(() => this.generateMarkdown()))
          .subscribe(
            (json: any) => {
              if (json) {
                this.cwltoolVersion = json.cwltool;
              }
            },
            err => {
              console.log('Unable to retrieve requirements.txt file.');
            }
          );
      },
      error => {
        this.generateMarkdown();
      }
    );
  }
  generateMarkdown(): void {
    this.textData1 = `
### Setup Command Line Interface (Ubuntu)
------------------------------
#### Requirements
1. Linux/Ubuntu (Recommended - Tested on 18.04.3 LTS) or Mac OS X machine
2. Java 11 (Tested with OpenJDK 11, Oracle JDK may work but is untested)
3. Python3 and pip3 (Optional: if working with CWL)

#### Part 1 - Install dependencies and Dockstore CLI
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
3. Install the dockstore command-line program and add it to the path.
\`\`\`
mkdir -p ~/bin
curl -L -o ~/bin/dockstore ${this.downloadCli}
chmod +x ~/bin/dockstore
echo 'export PATH=~/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
\`\`\`
3. Alternatively, click here to download and configure the CLI yourself.

`;
    this.textData2 = `
#### Part 2 - Setup Dockstore CLI Config
1. Create the folder \`~/.dockstore\` and create a configuration file \`~/.dockstore/config\`:
\`\`\`
mkdir -p ~/.dockstore
printf "token: ${this.dsToken}\\nserver-url: ${this.dsServerURI}\\n" > ~/.dockstore/config
\`\`\`
2. Alternatively, copy this content to your config file directly.
`;
    this.textData3 = `
#### Part 3 - Confirm installation
1. Run our dependencies to verify that they have been installed properly.
\`\`\`
$ java -version
openjdk version "11.0.4" 2019-07-16
$ dockstore --version
Dockstore version ${this.dockstoreVersion}
OpenJDK Runtime Environment (build 11.0.4+11-post-Ubuntu-1ubuntu218.04.3)
OpenJDK 64-Bit Server VM (build 11.0.4+11-post-Ubuntu-1ubuntu218.04.3, mixed mode, sharing)
$ docker run hello-world
Hello from Docker!
...
\`\`\`

#### Part 4 - Install cwltool (Optional)
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
`;
  }
}
