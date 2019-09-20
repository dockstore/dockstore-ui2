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

import { Injectable } from '@angular/core';

@Injectable()
export class TwitterService {
  constructor() {}
  runScript() {
    // https://stackoverflow.com/questions/42993859/twitter-widget-on-angular-2
    (<any>window).twttr = (function(d, s, id) {
      let js: any;
      const fjs = d.getElementsByTagName(s)[0];
      const t = (<any>window).twttr || {};
      if (d.getElementById(id)) {
        return t;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f: any) {
        t._e.push(f);
      };

      return t;
    })(document, 'script', 'twitter-wjs');

    if ((<any>window).twttr.ready()) {
      (<any>window).twttr.widgets.load();
    }
  }
}
