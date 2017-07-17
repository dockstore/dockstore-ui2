import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../token.service';
import { AuthService } from 'ng2-ui-auth';
import { Dockstore } from '../../../shared/dockstore.model';

@Component({
  selector: 'app-downloadcliclient',
  templateUrl: './downloadcliclient.component.html',
  styleUrls: ['./downloadcliclient.component.scss']
})
export class DownloadcliclientComponent implements OnInit {
  private downloadCli: string;
  private clickBoard = 'token: {{dsToken}} server-url: {{dsServerURI}}';
  private dsToken: any;
  private dsServerURI: any;

  constructor(private tokenService: TokenService,
              private authService: AuthService) { }

  ngOnInit() {
    this.dsToken = this.authService.getToken();
    this.dsServerURI = Dockstore.API_URI;
    let apiVersion = 'unreachable';
    this.tokenService.getWebServiceVersion().subscribe(
      resultFromApi => {
        apiVersion = resultFromApi.version;
        this.downloadCli = `https://github.com/ga4gh/dockstore/releases/download/${apiVersion}/dockstore`;
      }
    );
  }

}
