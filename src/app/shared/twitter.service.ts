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
  private TWITTER_WIDGET_URL = 'assets/mastodon-timeline.js';

  loadScript(): Observable<any> {
    return new Observable((observer) => {
      this.startScriptLoad();
      window['mt-timeline'].ready((mttimeline) => {
        observer.next(mttimeline);
        observer.complete();
      });
    });
  }

  private startScriptLoad() {
    window['mt-timeline'] = (function (d, s, id, url) {
      let script;
      const firstScriptEl = d.getElementsByTagName(s)[0],
        twitterScript = window['mt-timeline'] || {};
      if (d.getElementById(id)) {
        return twitterScript;
      }
      script = d.createElement(s);
      script.id = id;
      script.src = url;
      firstScriptEl.parentNode.insertBefore(script, firstScriptEl);

      twitterScript._e = [];

      twitterScript.ready = function (f) {
        twitterScript._e.push(f);
      };
      return twitterScript;
    })(document, 'script', this.TWITTER_SCRIPT_ID, this.TWITTER_WIDGET_URL);
  }

  createTimeline(element: ElementRef, tweetLimit: number) {
    window['mt-timeline'].buildTimeline().catch((error) => console.error(error));
  }
}
