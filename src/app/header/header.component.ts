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
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { toExtendSite } from '../shared/helpers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isExtended = false;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      this.isExtended = toExtendSite(this.router.url);
    });
  }

  ngOnInit() {
  }

}
