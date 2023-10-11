/**
 * Mastodon embed feed timeline v3.8.2
 * More info at:
 * https://gitlab.com/idotj/mastodon-embed-feed-timeline
 */

import { Component } from '@angular/core';
import { MastodonService } from './mastodon.service'; // Import the service

export interface MastodonTimelineData {
  postUrl: string;
  accountUrl: string;
  accountAvatar: string;
  reblogAccountAvatar: string;
  accountUsername: string;
  postDate: string;
  postContent: string;
  spoilerText: string;
  mediaContent: any[];
  previewLink: string;
  poll: any[];
}

@Component({
  selector: 'app-mastodon-timeline',
  templateUrl: './mastodon.component.html',
  styleUrls: ['./mastodon.component.scss'],
})
export class MastodonComponent {
  fetchedData: Map<string, (string | number | boolean)[]>;
  timelineData: MastodonTimelineData[] = [];
  containerBodyId: string = 'mt-body'; // Id of the <div> containing the timeline
  defaultTheme: string = 'light'; // Preferred color theme: 'light', 'dark' or 'auto'. Default: auto
  instanceUrl: string = 'https://genomic.social'; // Your Mastodon instance
  timelineType: string = 'profile'; // Choose type of toots to show in the timeline: 'local', 'profile', 'hashtag'. Default: local
  userId: string = '110973634882132620'; // Your user ID on Mastodon instance. Leave empty if you didn't choose 'profile' as type of timeline
  profileName: string = 'dockstore'; // Your user name on Mastodon instance. Leave empty if you didn't choose 'profile' as type of timeline
  hashtagName: string = ''; // The name of the hashtag. Leave empty if you didn't choose 'hashtag' as type of timeline
  tootsLimit: string = '2'; // Maximum amount of toots to get. Default: 20
  hideUnlisted: boolean = false; // Hide unlisted toots. Default: don't hide
  hideReblog: boolean = false; // Hide boosted toots. Default: don't hide
  hideReplies: boolean = false; // Hide replies toots. Default: don't hide
  hidePreviewLink: boolean = false; // Hide preview card if toot contains a link, photo or video from a URL. Default: don't hide
  hideEmojis: boolean = false; // Hide custom emojis available on the server. Default: don't hide
  markdownBlockquote: boolean = false; // Converts Markdown symbol ">" at the beginning of a paragraph into a blockquote HTML tag. Ddefault: don't apply
  textMaxLines: string = '0'; // Limit the text content to a maximum number of lines. Default: 0 (unlimited)
  linkSeeMore: string = 'See more posts at Mastodon'; // Customize the text of the link pointing to the Mastodon page (appears after the last toot)
  mastodonDockstoreLink = this.instanceUrl + '/@' + this.profileName;

  constructor(private mastodonService: MastodonService) {}

  ngOnInit(): void {
    // Initialize the Mastodon API and build the timeline here
    const params = {
      containerBodyId: this.containerBodyId,
      defaultTheme: this.defaultTheme,
      instanceUrl: this.instanceUrl,
      timelineType: this.timelineType,
      userId: this.userId,
      profileName: this.profileName,
      hashtagName: this.hashtagName,
      tootsLimit: this.tootsLimit,
      hideUnlisted: this.hideUnlisted,
      hideReblog: this.hideReblog,
      hideReplies: this.hideReplies,
      hidePreviewLink: this.hidePreviewLink,
      hideEmojis: this.hideEmojis,
      markdownBlockquote: this.markdownBlockquote,
      textMaxLines: this.textMaxLines,
      linkSeeMore: this.linkSeeMore,
    };
    this.mastodonService.initialize(params);
    this.mastodonService.fetchedDataSubject.subscribe((data) => {
      this.fetchedData = data;
      const timeline = this.fetchedData['timeline'];
      let postUrl;
      let accountUrl;
      let accountAvatar;
      let reblogAccountAvatar;
      let accountUsername;
      let postDate;
      let postContent;
      let spoilerText;
      let mediaContent;
      let previewLink;
      let poll;
      for (let i = 0; i < timeline.length; i++) {
        if (timeline[i]['reblog']) {
          postUrl = timeline[i]['reblog']['url'];
          accountUrl = timeline[i]['reblog']['account']['url'];
          accountAvatar = timeline[i]['account']['avatar'];
          reblogAccountAvatar = timeline[i]['reblog']['account']['avatar'];
          accountUsername = timeline[i]['reblog']['account']['username'];
          postDate = this.formatDate(timeline[i]['reblog']['created_at']);
          postContent = this.formatPostText(timeline[i]['reblog']['content']);
          spoilerText = timeline[i]['reblog']['spoiler_text'];
          mediaContent = timeline[i]['reblog']['media_attachments'];
          previewLink = timeline[i]['card'];
          poll = timeline[i]['poll'];
        } else {
          postUrl = timeline[i]['url'];
          accountUrl = timeline[i]['account']['url'];
          accountAvatar = timeline[i]['account']['avatar'];
          reblogAccountAvatar = null;
          accountUsername = timeline[i]['account']['username'];
          postDate = this.formatDate(timeline[i]['created_at']);
          postContent = this.formatPostText(timeline[i]['content']);
          spoilerText = timeline[i]['spoiler_text'];
          mediaContent = timeline[i]['media_attachments'];
          previewLink = timeline[i]['card'];
          poll = timeline[i]['poll'];
        }
        const timelinePost: MastodonTimelineData = {
          postUrl: postUrl,
          accountUrl: accountUrl,
          accountAvatar: accountAvatar,
          reblogAccountAvatar: reblogAccountAvatar,
          accountUsername: accountUsername,
          postDate: postDate,
          postContent: postContent,
          spoilerText: spoilerText,
          mediaContent: mediaContent,
          previewLink: previewLink,
          poll: poll,
        };
        this.timelineData.push(timelinePost);
      }
    });
  }

  /**
   * Format date
   * @param {string} d Date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
   * @returns {string} Date formated (MM DD, YYYY)
   */
  formatDate(d) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let date = new Date(d);

    const displayDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

    return displayDate;
  }

  formatPostText(content) {
    content = content.replaceAll('rel="tag"', 'rel="tag" target="_blank"');
    content = content.replaceAll('class="u-url mention"', 'class="u-url mention" target="_blank"');
    content = content.replaceAll('class="invisible"', 'class="hide"');
    return content;
  }
}
