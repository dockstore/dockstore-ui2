import { Injectable } from '@angular/core';
import { Organization } from './openapi';

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  contactPoint?: Array<ContactPoint>;
  description?: string;
  location?: string;
  logo?: string;
  name: string;
  url: string;
}

export interface ContactPoint {
  // Represents the contact email displayed on the organization page
  '@type': string;
  email: string;
}

@Injectable()
export class OrgschemaService {
  constructor() {}
  getSchema(org: Organization): OrganizationSchema {
    if (!org) {
      return null;
    }
    const results: OrganizationSchema = {
      '@context': 'http://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.link
    };
    if (org.avatarUrl) {
      results.logo = org.avatarUrl; // image link
    }
    if (org.description) {
      results.description = org.description;
    }
    if (org.email) {
      results.contactPoint = [{ '@type': 'ContactPoint', email: org.email }];
    }
    if (org.location) {
      results.location = org.location;
    }
    return results;
  }
}
