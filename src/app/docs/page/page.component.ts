import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Doc } from '../doc.model';
import { DocsService } from '../docs.service';

declare var Toc: any;

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit, AfterViewInit {

  private valid = true;
  private slug: string;

  selectedDoc: Doc;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private docsService: DocsService) {
  }

  getDoc(slug: string): Doc {
      return this.docsService.getDoc(slug);
  }

  ngOnInit() {
     this.activatedRoute.params.subscribe(
      (params: any) => {
        this.slug = params['slug'];
        this.selectedDoc = this.docsService.getDoc(this.slug);

        if (!this.selectedDoc) {
          this.valid = false;
          this.router.navigate(['/docs']);
        }
      });
  }

  private tocExists(): boolean {
    if (document) {
      const element = document.querySelector('#toc');
      if (element.querySelector('.nav')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private initToc(): void {
    const navSelector = '#toc';
    const $myNav = $(navSelector);

    Toc.init($myNav);

    (<any>$('body')).scrollspy({
      target: navSelector
    });
  }

  ngAfterViewInit() {
    if (this.valid) {
      this.activatedRoute.fragment.subscribe(anchor => {
        setTimeout(() => {
          const element = document.querySelector('#' + anchor);
          if (element) {
            element.scrollIntoView();
          }
          if (!this.tocExists()) {
            this.initToc();
          }
        }, 200);
      });
    }
  }

  private getAnchor(event): string {
    let anchorElement;

    if (event.srcElement) {
      anchorElement = event.srcElement;
    } else {
      // Firefox
      anchorElement = event.target;
    }

    const anchorLink = anchorElement.getAttribute('href');
    return anchorLink;
  }

  scrollToAnchor(event) {
    // do not navigate away
    event.preventDefault();

    // get anchor link
    const anchorLink = this.getAnchor(event);

    // remove # from anchor link to get fragment
    this.router.navigate([], { fragment: anchorLink.substring(1) });
  }
}
