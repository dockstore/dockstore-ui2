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

import { async, TestBed } from '@angular/core/testing';
import { HeaderModule } from './../shared/modules/header.module';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './../test/router-stubs';
import { DocsComponent } from './docs.component';

// Most of the testing code in this file was commented out because the DocsComponent would redirect
// to the production docs.dockstore.org during the test.  This would cause all the remaining tests to disconnect and error.
// Uncomment once a solution is found
describe('DocsComponent', () => {
  // let component: DocsComponent;
  // let fixture: ComponentFixture<DocsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocsComponent, RouterLinkStubDirective, RouterOutletStubComponent],
      imports: [HeaderModule]
    }).compileComponents();
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(DocsComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should render subject', () => {
  //   const h3 = fixture.debugElement.query(By.css('h3'));
  //   expect(h3.nativeElement.innerText).toBe(' Documentation');
  // });
});
