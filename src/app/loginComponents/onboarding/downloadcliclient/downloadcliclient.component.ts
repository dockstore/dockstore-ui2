// tslint:disable:max-line-length
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';

import { Dockstore } from '../../../shared/dockstore.model';
import { GA4GHService } from './../../../shared/swagger/api/gA4GH.service';
import { Metadata } from './../../../shared/swagger/model/metadata';
import { pipRequirements } from './pipRequirement';

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
  constructor(private authService: AuthService,
    private gA4GHService: GA4GHService) { }

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
        this.generateMarkdown();
      }, error => {
        this.generateMarkdown();
      });
  }
  generateMarkdown(): void {
    this.textData1 = `
### Setup Command Line Interface
------------------------------
#### Part 1
1. We recommend Linux (the Dockstore CLI should also work on Mac OS X). The rest of these instructions focus on Ubuntu, although the setup for other distributions should be fairly similar.
2. The Dockstore CLI uses Java, please install Java if you have not already by adding the Oracle Java repo and then installing Java. Note that if you are installing Java by some other mechanism, you will need to install at least Java 8, Update 101 (1.8.0_101-b13) and we have not tested with Java 9:
\`\`\`
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update && sudo apt-get install -y oracle-java8-set-default
\`\`\`
3. Install the dockstore command-line program and add it to the path
\`\`\`
mkdir -p ~/bin
curl -L -o ~/bin/dockstore ${this.downloadCli}
chmod +x ~/bin/dockstore
echo 'export PATH=~/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
\`\`\`
4. Alternatively, click here to download and configure the cli yourself

`;
    this.textData2 = `
#### Part 2
1. Create the folder <code>~/.dockstore</code> and create a configuration file \`~/.dockstore/config\`:
\`\`\`
mkdir -p ~/.dockstore
printf "token: ${this.dsToken}\\nserver-url: ${this.dsServerURI}\\n" > ~/.dockstore/config
\`\`\`
2. Alternatively, copy this content to your config file directly
`;
    this.textData3 = `
#### Part 3
If you want to launch CWL tools and workflows, Dockstore relies upon [cwltool](https://github.com/common-workflow-language/cwltool) being available on your PATH.  This will require [pip](https://pip.pypa.io/en/latest/installing/) if it is not already installed.

You can install the version of cwltool that we've tested for use with Dockstore using the following commands:
1. Run this to verify that pip has been installed \`pip --version\`
2. Run these commands to install cwltool
\`\`\`
curl -o requirements.txt "${Dockstore.LOCAL_URI}/metadata/runner_dependencies?client_version=${this.dockstoreVersion}&python_version=2"
pip install -r requirements.txt
\`\`\`
<!-- Workaround until https://github.com/common-workflow-language/cwltool/issues/524 is resolved -->
If using Python 3, install cwl-avro instead of avro.  Do this by running these commands:
\`\`\`
curl -o requirements.txt "${Dockstore.LOCAL_URI}/metadata/runner_dependencies?client_version=${this.dockstoreVersion}&python_version=3"
pip install -r requirements.txt
\`\`\`

3. Install Docker following the instructions on [Docker's website](https://docs.docker.com/engine/installation/linux/ubuntulinux/).
Ensure that you are able to run Docker without using sudo directly with the
[post install instructions](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user).
\`\`\`
sudo usermod -aG docker $USER
exec newgrp docker
\`\`\`

#### Part 4
1. Run our dependencies to verify that they have been installed properly. You should see something like the following.
\`\`\`
$ dockstore --version
Dockstore version ${this.dockstoreVersion}
$ java -version
java version "1.8.0_144"
Java(TM) SE Runtime Environment (build 1.8.0_144-b01)
Java HotSpot(TM) 64-Bit Server VM (build 25.144-b01, mixed mode)
$ cwltool --version
/usr/local/bin/cwltool ${pipRequirements.cwltoolVersion}
$ docker run hello-world
Hello from Docker!
...
\`\`\`
In addition to the tools mentioned above you can install an editor capable of syntax highlighting Dockerfiles such as [Atom](https://atom.io/).
`;
  }
}
