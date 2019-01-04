import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationStore } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  constructor(private organizationStore: OrganizationStore,
              private http: HttpClient) {
  }

}
