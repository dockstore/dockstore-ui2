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
export class OrgSchemaService {
  constructor() {}
  getSchema(org: Organization): OrganizationSchema | null {
    if (!org) {
      return null;
    }
    const schema: OrganizationSchema = {
      '@context': 'http://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.link
    };
    if (org.avatarUrl) {
      schema.logo = org.avatarUrl; // image link
    }
    if (org.description) {
      schema.description = org.description;
    }
    if (org.email) {
      schema.contactPoint = [{ '@type': 'ContactPoint', email: org.email }];
    }
    if (org.location) {
      schema.location = org.location;
    }
    return schema;
  }
}
