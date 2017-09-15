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
  public downloadCli: string;
  public dsToken: any;
  public dsServerURI: any;

  constructor(private authService: AuthService,
              private gA4GHService: GA4GHService) { }

  ngOnInit() {
    this.dsToken = this.authService.getToken();
    this.dsServerURI = Dockstore.API_URI;
    let apiVersion = 'unreachable';
    this.gA4GHService.metadataGet().subscribe(
      (resultFromApi: Metadata) => {
        apiVersion = resultFromApi.version;
        this.downloadCli = `https://github.com/ga4gh/dockstore/releases/download/${apiVersion}/dockstore`;
      });
  }

}
