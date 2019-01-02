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
import { faSort, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';

import { DockstoreService } from './dockstore.service';
import { Label } from './swagger/model/label';
import { WorkflowVersion } from './swagger/model/workflowVersion';

describe('DockstoreService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DockstoreService],
        });
    });

    it('should be created', inject([DockstoreService], (service: DockstoreService) => {
        expect(service).toBeTruthy();
    }));
    it('should get valid versions', inject([DockstoreService], (service: DockstoreService) => {
        const workflowVersion1: WorkflowVersion = {
            name: 'a',
            reference: '1',
            valid: false
        };
        const workflowVersion2: WorkflowVersion = {
            name: 'b',
            reference: '2',
            valid: false
        };
        const workflowVersion3: WorkflowVersion = {
            name: 'c',
            reference: '3',
            valid: true
        };
        expect(service.getValidVersions([workflowVersion1, workflowVersion2, workflowVersion3])).toEqual([workflowVersion3]);
    }));
    it('should get if verified', inject([DockstoreService], (service: DockstoreService) => {
        const workflowVersion1: WorkflowVersion = {
            name: 'a',
            reference: '1',
            valid: false,
            verified: false
        };
        const workflowVersion2: WorkflowVersion = {
            name: 'b',
            reference: '2',
            valid: false,
            verified: false
        };
        const workflowVersion3: WorkflowVersion = {
            name: 'c',
            reference: '3',
            valid: true,
            verified: true
        };
        expect(service.getVersionVerified([workflowVersion1, workflowVersion2, workflowVersion3])).toBeTruthy();
        expect(service.getVersionVerified([workflowVersion1, workflowVersion2, workflowVersion2])).toBeFalsy();
    }));
    it('should get verified sources', inject([DockstoreService], (service: DockstoreService) => {
        const workflowVersion1: WorkflowVersion = {
            name: 'a',
            reference: '1',
            valid: false,
            verified: false,
            verifiedSource: null
        };
        const workflowVersion2: WorkflowVersion = {
            name: 'b',
            reference: '2',
            valid: false,
            verified: false,
            verifiedSource: null
        };
        const workflowVersion3: WorkflowVersion = {
            name: 'c',
            reference: '3',
            valid: true,
            verified: true,
            verifiedSource: 'tester'
        };
        const workflow: any = {
            workflowVersions: [workflowVersion1, workflowVersion2, workflowVersion3]
        };
        const tool: any = {
            tags: [workflowVersion1, workflowVersion2, workflowVersion3]
        };
        expect(service.getVerifiedWorkflowSources(workflow)).toEqual([{version: 'c', verifiedSource: 'tester'}]);
        expect(service.getVerifiedSources(tool)).toEqual([{version: 'c', verifiedSource: 'tester'}]);
    }));
    it('should get sort labels objects', inject([DockstoreService], (service: DockstoreService) => {
        const label1: Label = {
            id: 1,
            value: 'a'
        };
        const label2: Label = {
            id: 2,
            value: 'b'
        };
        const label3: Label = {
            id: 3,
            value: 'c'
        };
        expect(service.getLabelStrings([label3, label2, label1])).toEqual(['a', 'b', 'c']);
    }));
    it('should strip mail to', inject([DockstoreService], (service: DockstoreService) => {
        const email = 'mailto:gary.luu@oicr.on.ca';
        expect(service.stripMailTo(email)).toEqual('gary.luu@oicr.on.ca');
        expect(service.stripMailTo(null)).toEqual(null);
    }));

    it('should get icon class', inject([DockstoreService], (service: DockstoreService) => {
        expect(service.getIconClass('a', 'a', true)).toEqual(faSortAlphaUp);
        expect(service.getIconClass('a', 'b', true)).toEqual(faSort);
        expect(service.getIconClass('a', 'a', false)).toEqual(faSortAlphaDown);
    }));
});
