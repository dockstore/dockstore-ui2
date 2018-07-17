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

import { DateService } from './date.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ContainersStubService } from '../test/service-stubs';
import { ContainersService } from './swagger/api/containers.service';
import { ImageProviderService } from './image-provider.service';
import { TestBed, inject } from '@angular/core/testing';

describe('DateService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DateService]
        });
    });

    it('should be created', inject([DateService], (service: DateService) => {
        expect(service).toBeTruthy();
    }));
    it('should be getDateTimeMessage', inject([DateService], (service: DateService) => {
        const date: String = service.getDateTimeMessage(1504214211322);
        const result = (date === 'Aug. 31 2017 at 9:16:51 PM' || date === 'Aug. 31 2017 at 17:16:51');
    }));
    it('should be getAgoMessage', inject([DateService], (service: DateService) => {
        expect(service.getAgoMessage(null)).toEqual('n/a');
        expect(service.getAgoMessage(1498675698000)).toContain(' days ago');
    }));
    it('should be getVerifiedLink', inject([DateService], (service: DateService) => {
        expect(service.getVerifiedLink()).toEqual('https://docs.dockstore.org/faq/#what-is-a-verified-tool-or-workflow');
    }));
});
