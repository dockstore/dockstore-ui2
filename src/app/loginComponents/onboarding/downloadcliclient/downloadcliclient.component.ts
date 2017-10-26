import { Metadata } from './../../../shared/swagger/model/metadata';
import { GA4GHService } from './../../../shared/swagger/api/gA4GH.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Dockstore } from '../../../shared/dockstore.model';

@Component({
  selector: 'app-downloadcliclient',
  templateUrl: './downloadcliclient.component.html',
  styleUrls: ['./downloadcliclient.component.scss']
})
export class DownloadCLIClientComponent implements OnInit {
  public downloadCli = 'dummy-start-value';
  public dockstoreVersion = 'dummy-start-value';
  public dsToken = 'dummy-token';
  public cwltoolVersion = '1.0.20170828135420';
  public dsServerURI: any;
  public isCopied2: boolean;
  public part3Code;
  public part4Code;

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
      });
    this.part3Code = `
1. Run this to verify that pip has been installed \`pip --version\`
2. Run these commands to install cwltool
\`\`\`
pip install setuptools==36.5.0
pip install cwl-runner cwltool==${this.cwltoolVersion} schema-salad==2.6.20170806163416 avro==1.8.1 ruamel.yaml==0.14.12 requests==2.18.4
\`\`\`
3. Install Docker following the instructions on [Docker's website](https://docs.docker.com/engine/installation/linux/ubuntulinux/).
Ensure that you are able to run Docker without using sudo directly with the
[post install instructions](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user).
\`\`\`
sudo usermod -aG docker $USER
exec newgrp docker
\`\`\`
  `;

    this.part4Code = `
\`\`\`
$ dockstore --version
Dockstore version ${this.dockstoreVersion}
$ java -version
java version "1.8.0_144"
Java(TM) SE Runtime Environment (build 1.8.0_144-b01)
Java HotSpot(TM) 64-Bit Server VM (build 25.144-b01, mixed mode)
$ cwltool --version
/usr/local/bin/cwltool ${this.cwltoolVersion}
$ docker run hello-world
Hello from Docker!
...
\`\`\`
    `
      ;
  }
}
