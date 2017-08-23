import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Dockstore } from '../../../shared/dockstore.model';
import { VersionsService } from '../../../footer/versions.service';
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
              private versionsService: VersionsService) { }

  ngOnInit() {
    this.dsToken = this.authService.getToken();
    this.dsServerURI = Dockstore.API_URI;
    let apiVersion = 'unreachable';
    this.versionsService.getVersion().subscribe(
      resultFromApi => {
        apiVersion = resultFromApi.version;
        this.downloadCli = `https://github.com/ga4gh/dockstore/releases/download/${apiVersion}/dockstore`;
      });
  }

}
