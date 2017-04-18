import { Component, OnInit } from '@angular/core';

import { TokenService } from '../../token.service';

@Component({
  selector: 'app-accounts-external',
  templateUrl: './accounts.component.html',
  providers: [ TokenService ]
})
export class AccountsExternalComponent implements OnInit {

  readonly accountsInfo = [
    {
      name: 'GitHub',
      bold: 'Required',
      message: 'GitHub credentials are used for login purposes as well as for pulling source code from GitHub.'
    },
    {
      name: 'Bitbucket',
      bold: 'Optional',
      message: 'Bitbucket credentials are used for pulling source code from Bitbucket.'
    },
    {
      name: 'GitLab',
      bold: 'Optional',
      message: 'GitLab credentials are used for pulling source code from GitLab.'
    },
    {
      name: 'Quay.io',
      bold: 'Optional',
      message: 'Quay.io credentials are used for pulling information about Docker images and automated builds.'
    }
  ];

  constructor(private tokenService: TokenService) { }

  link(accountName) {
    console.log(accountName);
  }

  ngOnInit() {
  }
}
