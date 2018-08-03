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

  constructor() { }
  runScript() {
    const id = 'twitter-wjs';
    if (document.getElementById(id)) {
      return;
    }
    const doc = document;
    const script = 'script';
    let js: any;
    const scriptElement = doc.getElementsByTagName(script)[0];
    js = doc.createElement(script);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    scriptElement.parentNode.insertBefore(js, scriptElement);
  }
}
