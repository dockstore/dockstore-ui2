import { Label } from './swagger/model/label';
import { WorkflowsService } from './swagger/api/workflows.service';
import { ContainersStubService, WorkflowsStubService } from '../test/service-stubs';
import { ContainersService } from './swagger';
import { WorkflowVersion } from './swagger/model/workflowVersion';
import { DockstoreService } from './dockstore.service';

import { TestBed, inject } from '@angular/core/testing';

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
    it('should get highlight code', inject([DockstoreService], (service: DockstoreService) => {
        const code = 'FROM ubuntu:16.04';
        expect(service.highlightCode(code)).toEqual('<pre><code class="YAML highlight">FROM ubuntu:16.04</pre></code>');
    }));
    it('should strip mail to', inject([DockstoreService], (service: DockstoreService) => {
        const email = 'mailto:gary.luu@oicr.on.ca';
        expect(service.stripMailTo(email)).toEqual('gary.luu@oicr.on.ca');
        expect(service.stripMailTo(null)).toEqual(null);
    }));

    it('should get icon class', inject([DockstoreService], (service: DockstoreService) => {
        expect(service.getIconClass('a', 'a', true)).toEqual('glyphicon-sort-by-alphabet-alt');
        expect(service.getIconClass('a', 'b', true)).toEqual('glyphicon-sort');
        expect(service.getIconClass('a', 'a', false)).toEqual('glyphicon-sort-by-alphabet');
    }));
});
