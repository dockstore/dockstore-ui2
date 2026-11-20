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

import { Renderer2 } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { WorkflowsService } from '../../../shared/openapi/api/workflows.service';
import { WorkflowsStubService } from '../../../test/service-stubs';
import { DagQuery } from './dag.query';
import { DagService } from './dag.service';
import { DagStore } from './dag.store';
import { DescriptorLanguageService } from '../../../shared/entry/descriptor-language.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

 

describe('Service: Dag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DagService,
        DagStore,
        DagQuery,
        Renderer2,
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should ...', inject([DagService], (service: DagService) => {
    expect(service).toBeTruthy();
  }));
  it(`should check if it's n/a`, inject([DagService], (service: DagService) => {
    expect(service.isValidUrl('http://www.google.ca')).toBeTruthy();
    expect(service.isValidUrl('asdf')).toBeFalsy();
  }));
  it('should set dynamic popover with lots of n/a', inject([DagService], (service: DagService) => {
    const tooltipText = `
    <div>
    <div><b>Type: </b>n/a</div>
    <div><b>Run: </b>n/a</div>
    <div><b>Docker: </b>n/a</div>
    </div>`;
    expect(service.getTooltipText(undefined, '', undefined, undefined, undefined)).toEqual(tooltipText);
  }));
  it('should set dynamic popover with lots of other info', inject([DagService], (service: DagService) => {
    expect(service.getTooltipText(undefined, 'http://validlink.com', undefined, 'valid link', 'http://fakewebsite.com')).toEqual(`
    <div>
    <div><b>Type: </b>n/a</div>
    <div><b>Run: </b> <a href='http://fakewebsite.com'>http://fakewebsite.com</a></div>
    <div><b>Docker: </b> <a href='http://validlink.com'>valid link</a></div>
    </div>`);
  }));

  it('should only treat http(s) URLs as valid', inject([DagService], (service: DagService) => {
    expect(service.isValidUrl('https://hub.docker.com/r/foo/bar')).toBeTruthy();
    expect(service.isValidUrl('javascript:alert(1)')).toBeFalsy();
    expect(service.isValidUrl('data:text/html,<script>alert(1)</script>')).toBeFalsy();
    expect(service.isValidUrl(undefined)).toBeFalsy();
  }));
  it('should escape HTML in user-controlled DAG node data', inject([DagService], (service: DagService) => {
    const payload = 'alpine:3.19<img src=x onerror=alert(1)>';
    expect(
      service.getTooltipText(payload, `https://example.com/'onmouseover='alert(1)`, payload, payload, `http://example.com/'><img src=x>`)
    ).toEqual(`
    <div>
    <div><b>Type: </b>alpine:3.19&lt;img src=x onerror=alert(1)&gt;</div>
    <div><b>Run: </b> <a href='http://example.com/&#39;&gt;&lt;img src=x&gt;'>http://example.com/&#39;&gt;&lt;img src=x&gt;</a></div>
    <div><b>Docker: </b> <a href='https://example.com/&#39;onmouseover=&#39;alert(1)'>alpine:3.19&lt;img src=x onerror=alert(1)&gt;</a></div>
    </div>`);
  }));
  it('should not link to non-http(s) URLs', inject([DagService], (service: DagService) => {
    expect(service.getDockerText('javascript:alert(1)', 'docker')).toEqual('<div><b>Docker: </b>docker</div>');
    expect(service.getRunText('javascript:alert(1)')).toEqual('<div><b>Run: </b>javascript:alert(1)</div>');
  }));

  it('should get DAG', inject([DagService], (service: DagService) => {
    service.getCurrentDAG(2, 2).subscribe((results) => expect(results).toEqual('someDAG'));
    expect(service.getCurrentDAG(null, null)).toBeFalsy();
  }));
});
