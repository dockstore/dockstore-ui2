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

import { inject, TestBed } from '@angular/core/testing';
import { Dockstore } from '../shared/dockstore.model';
import { DateService } from './date.service';

describe('DateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
    });
  });

  it('should be created', inject([DateService], (service: DateService) => {
    expect(service).toBeTruthy();
  }));
  it('should be getDateTimeMessage', inject([DateService], (service: DateService) => {
    const date: String = service.getDateTimeMessage(1504214211322);
    // The timezone will be different for CI and developers, have to use regex
    expect(date).toEqual(jasmine.stringMatching(/^Aug\. 31 2017 at [0-9]+:16:51.*$/));
  }));
  it('should be getAgoMessage', inject([DateService], (service: DateService) => {
    expect(service.getAgoMessage(null)).toEqual(null);
    // timestamp from a week ago should include days
    expect(service.getAgoMessage(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)).toContain(' days ago');
    // time stamp from a long time ago will list the date
    expect(service.getAgoMessage(1498675698000)).toContain('2017');
  }));
  it('should be getVerifiedLink', inject([DateService], (service: DateService) => {
    expect(service.getVerifiedLink()).toEqual(Dockstore.DOCUMENTATION_URL + '/faq.html#what-is-a-verified-tool-or-workflow');
  }));
  it('should be ISO8601Format when given number', inject([DateService], (service: DateService) => {
    expect(service.getISO8601Format(1498675698000)).toEqual('2017-06-28T18:48:18.000Z');
  }));
  it('should be ISO8601Format when given Date', inject([DateService], (service: DateService) => {
    const tsAsDate = new Date(1498675698000);
    expect(service.getISO8601Format(tsAsDate)).toEqual('2017-06-28T18:48:18.000Z');
  }));
});
