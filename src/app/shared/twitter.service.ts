import { Injectable } from '@angular/core';

@Injectable()
export class TwitterService {

  constructor() { }
  runScript() {
    const doc = document;
    const script = 'script';
    const id = 'twitter-wjs';
    let js: any;
    const scriptElement = doc.getElementsByTagName(script)[0];
    js = doc.createElement(script);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    scriptElement.parentNode.insertBefore(js, scriptElement);
  }

}
