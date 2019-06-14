import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Dockstore } from '../dockstore.model';
import { ToolTesterLogPipe } from './tool-tester-log.pipe';

describe('Pipe: ToolTesterLoge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
  });
  it('create an instance', inject([Router], (router: Router) => {
    const pipe = new ToolTesterLogPipe(router);
    expect(pipe).toBeTruthy();
    expect(pipe.transform('quay.io/pancancer/pcawg-bwa-mem-workflow', '1.0.0', 'test1.json', 'FULL', '1556226034.log')).toBe(
      // tslint:disable-next-line: max-line-length
      `${Dockstore.API_URI}/toolTester/logs?tool_id=quay.io%2Fpancancer%2Fpcawg-bwa-mem-workflow&tool_version_name=1.0.0&test_filename=test1.json&runner=FULL&log_type=FULL&filename=1556226034.log`
    );
  }));
});
