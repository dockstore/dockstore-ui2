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
import { Dockstore } from '../shared/dockstore.model';

@Injectable()
export class DateService {
  private static readonly months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

  // get a message containing both the day and time of day
  getDateTimeMessage(timestamp: number, dateOnly = false): string | null {
    let dateString = null;
    if (timestamp) {
      const date = new Date(timestamp);
      dateString = DateService.months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
      if (!dateOnly) {
        dateString += ' at ' + date.toLocaleTimeString();
      }
    }
    return dateString;
  }

  private getTime(timestamp: number, convert: number): number {
    const timeDiff = new Date().getTime() - timestamp;
    return Math.floor(timeDiff / convert);
  }

  /*Note: change this link if necessary */
  getVerifiedLink(): string {
    return Dockstore.DOCUMENTATION_URL + '/faq.html#what-is-a-verified-tool-or-workflow';
  }

  getAgoMessage(timestamp: number): string | null {
    if (timestamp) {
      const msToMins = 1000 * 60;
      const msToHours = msToMins * 60;
      const msToDays = msToHours * 24;
      const msToYears = msToDays * 365;

      let time = this.getTime(timestamp, msToYears);
      if (time < 1) {
        time = this.getTime(timestamp, msToDays);

        if (time < 1) {
          time = this.getTime(timestamp, msToHours);

          if (time < 1) {
            time = this.getTime(timestamp, msToMins);

            if (time < 1) {
              return '< 1 minute ago';
            } else {
              return time + (time === 1 ? ' minute ago' : ' minutes ago');
            }
          } else {
            return time + (time === 1 ? ' hour ago' : ' hours ago');
          }
        } else {
          return time + (time === 1 ? ' day ago' : ' days ago');
        }
      } else {
        return this.getDateTimeMessage(timestamp, true);
      }
    } else {
      return null;
    }
  }
  getISO8601Format(timestamp: Date | number): string | null {
    if (timestamp) {
      return new Date(timestamp).toISOString();
    } else {
      return null;
    }
  }
}
