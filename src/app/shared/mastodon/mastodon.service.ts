/**
 *    Copyright 2023 OICR
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

/**
 * Mastodon embed feed timeline v3.8.2
 * More info at:
 * https://gitlab.com/idotj/mastodon-embed-feed-timeline
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MastodonService {
  DEFAULT_THEME: string;
  INSTANCE_URL: string;
  USER_ID: string;
  PROFILE_NAME: string;
  TIMELINE_TYPE: string;
  HASHTAG_NAME: string;
  TOOTS_LIMIT: string;
  HIDE_UNLISTED: boolean;
  HIDE_REBLOG: boolean;
  HIDE_REPLIES: boolean;
  HIDE_PREVIEW_LINK: boolean;
  HIDE_EMOJIS: boolean;
  MARKDOWN_BLOCKQUOTE: boolean;
  TEXT_MAX_LINES: string;
  LINK_SEE_MORE: string;
  FETCHED_DATA: any;
  mtBodyContainer: HTMLElement;
  public fetchedDataSubject = new Subject<Map<string, (string | number | boolean)[]>>();

  constructor() {
    this.fetchedDataSubject.subscribe((value) => {
      this.FETCHED_DATA = value;
    });
  }

  getFetchedData() {
    return this.FETCHED_DATA;
  }
  initialize(params: any) {
    this.DEFAULT_THEME = params.defaultTheme || 'auto';
    this.INSTANCE_URL = params.instanceUrl || '';
    this.USER_ID = params.userId || '';
    this.PROFILE_NAME = this.USER_ID ? params.profileName : '';
    this.TIMELINE_TYPE = params.timelineType || 'local';
    this.HASHTAG_NAME = params.hashtagName || '';
    this.TOOTS_LIMIT = params.tootsLimit || '20';
    this.HIDE_UNLISTED = typeof params.hideUnlisted !== 'undefined' ? params.hideUnlisted : false;
    this.HIDE_REBLOG = typeof params.hideReblog !== 'undefined' ? params.hideReblog : false;
    this.HIDE_REPLIES = typeof params.hideReplies !== 'undefined' ? params.hideReplies : false;
    this.HIDE_PREVIEW_LINK = typeof params.hidePreviewLink !== 'undefined' ? params.hidePreviewLink : false;
    this.HIDE_EMOJIS = typeof params.hideEmojis !== 'undefined' ? params.hideEmojis : false;
    this.MARKDOWN_BLOCKQUOTE = typeof params.markdownBlockquote !== 'undefined' ? params.markdownBllockquote : false;
    this.TEXT_MAX_LINES = params.textMaxLines || '0';
    this.LINK_SEE_MORE = params.linkSeeMore;
    this.FETCHED_DATA = {};

    this.mtBodyContainer = document.getElementById(params.containerBodyId);

    this.buildTimeline();
  }

  buildTimeline() {
    // Apply color theme
    this.setTheme();

    // Get server data
    this.getTimelineData().then(() => {
      this.fetchedDataSubject.next(this.FETCHED_DATA);
    });
  }

  /**
   * Set the theme style chosen by the user or by the browser/OS
   */
  setTheme() {
    /**
     * Set the theme value in the <html> tag using the attribute "data-theme"
     * @param {string} theme Type of theme to apply: dark or light
     */
    const setTheme = function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    };

    if (this.DEFAULT_THEME === 'auto') {
      let systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
      systemTheme.matches ? setTheme('dark') : setTheme('light');
      // Update the theme if user change browser/OS preference
      systemTheme.addEventListener('change', (e) => {
        e.matches ? setTheme('dark') : setTheme('light');
      });
    } else {
      setTheme(this.DEFAULT_THEME);
    }
  }

  /**
   * Requests to the server to get all the data
   */
  getTimelineData() {
    return new Promise<void>((resolve, reject) => {
      /**
       * Fetch data from server
       * @param {string} url address to fetch
       * @returns {object} List of objects
       */
      async function fetchData(url) {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            'Failed to fetch the following URL: ' +
              url +
              '<hr>' +
              'Error status: ' +
              response.status +
              '<hr>' +
              'Error message: ' +
              response.statusText
          );
        }

        const data = await response.json();
        return data;
      }

      // URLs to fetch
      let urls = { timeline: '', emojis: '' };
      if (this.TIMELINE_TYPE === 'profile') {
        urls.timeline = `${this.INSTANCE_URL}/api/v1/accounts/${this.USER_ID}/statuses?limit=${this.TOOTS_LIMIT}`;
      } else if (this.TIMELINE_TYPE === 'hashtag') {
        urls.timeline = `${this.INSTANCE_URL}/api/v1/timelines/tag/${this.HASHTAG_NAME}?limit=${this.TOOTS_LIMIT}`;
      } else if (this.TIMELINE_TYPE === 'local') {
        urls.timeline = `${this.INSTANCE_URL}/api/v1/timelines/public?local=true&limit=${this.TOOTS_LIMIT}`;
      }
      if (!this.HIDE_EMOJIS) {
        urls.emojis = this.INSTANCE_URL + '/api/v1/custom_emojis';
      }

      const urlsPromises = Object.entries(urls).map(([key, url]) => {
        return fetchData(url)
          .then((data) => ({ [key]: data }))
          .catch((error) => {
            reject(new Error('Something went wrong fetching data'));
            this.mtBodyContainer.innerHTML =
              '<div class="mt-error"><span class="mt-error-icon">❌</span><br/><strong>Sorry, request failed:</strong><br/><div class="mt-error-message">' +
              error.message +
              '</div></div>';
            this.mtBodyContainer.setAttribute('role', 'none');
            return { [key]: [] };
          });
      });

      // Fetch all urls simultaneously
      Promise.all(urlsPromises).then((dataObjects) => {
        this.FETCHED_DATA = dataObjects.reduce((result, dataItem) => {
          return { ...result, ...dataItem };
        }, {});

        resolve();
      });
    });
  }
}
