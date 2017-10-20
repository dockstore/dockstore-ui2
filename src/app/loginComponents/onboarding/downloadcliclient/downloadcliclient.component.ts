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
        this.dockstoreVersion = `${ apiVersion }`;
        this.downloadCli = `https://github.com/ga4gh/dockstore/releases/download/${apiVersion}/dockstore`;
      });
  }

}
