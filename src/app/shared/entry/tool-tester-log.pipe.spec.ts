/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolTesterLogPipe } from './tool-tester-log.pipe';

describe('Pipe: ToolTesterLoge', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule
        ]
      });
  });
  it('create an instance', inject([Router], (router: Router) => {
    const pipe = new ToolTesterLogPipe(router);
    expect(pipe).toBeTruthy();
    expect(pipe.transform('thing', 'thing', 'thing', 'FULL', 'thing.log'))
      .toContain('/toolTester/logs?tool_id=thing&tool_version_name=thing&test_filename=thing&runner=FULL&log_type=FULL&filename=thing.log');
  }));
});

