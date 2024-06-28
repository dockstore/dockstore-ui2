/*
 *
 *  Copyright 2024 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import { HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * Created by Ron on 17/12/2015.
 */

export function joinUrl(baseUrl: string, url: string) {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }

  const joined = [baseUrl, url].join('/');

  return joined.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
}

export function buildQueryString(obj: object) {
  return Object.keys(obj)
    .map((key) => (!!obj[key] ? `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}` : key))
    .join('&');
}

export function getWindowOrigin(w?: Window) {
  if (!w && typeof window !== 'undefined') {
    w = window;
  }
  try {
    if (!w || !w.location) {
      return null;
    }
    if (!w.location.origin) {
      return `${w.location.protocol}//${w.location.hostname}${w.location.port ? ':' + w.location.port : ''}`;
    }
    return w.location.origin;
  } catch (error) {
    return null;
    // ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
    // error instanceof DOMException && error.name === 'SecurityError'
  }
}
