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

import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Handle twitter-related actions
 * See https://github.com/ABD-dev/ngx-twitter-timeline
 *
 * @export
 * @class TwitterService
 */
@Injectable()
export class TwitterService {
  private TWITTER_SCRIPT_ID = 'twitter-wjs';
  private TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';

  constructor() {}

  loadScript(): Observable<any> {
    return Observable.create(observer => {
      this.startScriptLoad();

      window['twttr'].ready(twttr => {
        observer.next(twttr);
        observer.complete();
      });
    });
  }

  private startScriptLoad() {
    window['twttr'] = (function(d, s, id, url) {
      let script;
      const firstScriptEl = d.getElementsByTagName(s)[0],
        twitterScript = window['twttr'] || {};
      if (d.getElementById(id)) {
        return twitterScript;
      }

      script = d.createElement(s);
      script.id = id;
      script.src = url;
      firstScriptEl.parentNode.insertBefore(script, firstScriptEl);

      twitterScript._e = [];

      twitterScript.ready = function(f) {
        twitterScript._e.push(f);
      };

      return twitterScript;
    })(document, 'script', this.TWITTER_SCRIPT_ID, this.TWITTER_WIDGET_URL);
  }

  createTimeline(element: ElementRef, tweetLimit: number) {
    const nativeElement = element.nativeElement;
    nativeElement.innerHTML = '';
    window['twttr'].widgets
      .createTimeline({ sourceType: 'url', url: 'https://twitter.com/dockstoreOrg' }, nativeElement, {
        theme: 'light',
        tweetLimit: tweetLimit
      })
      .then(embed => {
        // console.log(embed);
      })
      .catch(error => console.error(error));
  }
}
