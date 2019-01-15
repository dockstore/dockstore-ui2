import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../state/organization.service';
import { OrganizationQuery } from '../state/organization.query';

@Component({
  selector: 'organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  constructor(private organizationQuery: OrganizationQuery,
              private organizationService: OrganizationService
  ) { }

  ngOnInit() {}
}
