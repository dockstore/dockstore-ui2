import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ExecutionStatusPipe } from './execution-status.pipe';
import { RunExecution } from '../openapi';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import ExecutionStatusEnum = RunExecution.ExecutionStatusEnum;

describe('Pipe: ExecutionStatus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ExecutionStatusPipe, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
  });

  it('create an instance', () => {
    const pipe = new ExecutionStatusPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(ExecutionStatusEnum.ALL)).toBe('All Statuses');
    expect(pipe.transform(ExecutionStatusEnum.SUCCESSFUL)).toBe('Successful');
    expect(pipe.transform(ExecutionStatusEnum.ABORTED)).toBe('Aborted');
    expect(pipe.transform(ExecutionStatusEnum.FAILED)).toBe('Failed');
    expect(pipe.transform(ExecutionStatusEnum.FAILEDRUNTIMEINVALID)).toBe('Failed Runtime Invalid');
    expect(pipe.transform(ExecutionStatusEnum.FAILEDSEMANTICINVALID)).toBe('Failed Semantic Invalid');
  });
});
