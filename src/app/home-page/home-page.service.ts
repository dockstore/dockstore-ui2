import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  constructor(private router: Router) {}
  hpOrgSchema = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    description:
      'Dockstore, developed by the Cancer Genome Collaboratory, is an open platform used by the GA4GH for sharing ' +
      'Docker-based tools described with the Common Workflow Language (CWL), the Workflow Description Language (WDL), or Nextflow (NFL)',
    logo: '../assets/images/dockstore/dockstore.png',
    name: 'Dockstore',
    sameAs: 'https://github.com/dockstore',
    url: window.location.href
  };

  hpWebsiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    audience: 'Bioinformaticians',
    name: 'Dockstore',
    potentialAction: {
      '@type': 'SearchAction',
      target: window.location.href + 'search?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    url: window.location.href
  };

  goToSearch(searchValue: string) {
    this.router.navigate(['/search'], { queryParams: { search: searchValue } });
  }
}
