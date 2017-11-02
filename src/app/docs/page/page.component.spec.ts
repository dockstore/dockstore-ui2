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

import { TwitterService } from './../../shared/twitter.service';
import { DocsStubService } from './../../test/service-stubs';
import { DocsService } from './../docs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRouteStub, ActivatedRoute } from './../../test/router-stubs';
import { MarkdownModule } from 'angular2-markdown';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageComponent,
        RouterLinkStubDirective, RouterOutletStubComponent],
      imports: [MarkdownModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: DocsService, useClass: DocsStubService },
        TwitterService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
