/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Doc } from '../doc.model';
import { DocsService } from '../docs.service';
import { TwitterService } from '../../shared/twitter.service';

declare var Toc: any;

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit, AfterViewInit {

  private valid = true;
  public slug: string;

  selectedDoc: Doc;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private docsService: DocsService,
              private twitterService: TwitterService) {
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
      if (this.slug === 'blog') {
        this.twitterService.runScript();
      }
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
