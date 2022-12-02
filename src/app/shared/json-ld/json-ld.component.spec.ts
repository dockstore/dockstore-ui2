/*
 * MIT License
 *
 * Copyright (c) 2018 Cory Rylan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 *
 *  Copyright 2022 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonLdComponent } from './json-ld.component';

/**
 * The following code was adapted from https://github.com/coryrylan/ngx-lite,
 * as that repo and its corresponding NPM releases have not kept up with the latest Angular releases.
 * The original code was licensed under the included MIT license, and we sublicense the derived code
 * under the included Apache license.  The included MIT license does not apply to other source files,
 * except where noted.
 */

const testSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://www.example.com',
  name: 'Unlimited Ball Bearings Corp.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-401-555-1212',
    contactType: 'Customer service',
  },
  scriptTest: '<script>window.scriptInjection = true</script>',
};

describe('JsonLdComponent', () => {
  let component: JsonLdComponent;
  let fixture: ComponentFixture<JsonLdComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [JsonLdComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonLdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create schema in the template', () => {
    component.json = testSchema;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('https://schema.org');
  });

  it('should update schema in template', () => {
    const initialName = testSchema.name;
    const predictedName = 'Limited Ball Bearings Corp.';

    component.json = testSchema;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(initialName);

    testSchema.name = predictedName;
    component.json = testSchema;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(predictedName);
  });

  it('should prevent script injection', () => {
    component.json = testSchema;
    fixture.detectChanges();
    expect((window as any).scriptInjection).toBe(undefined);
  });
});
