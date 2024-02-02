import { Pipe, PipeTransform } from '@angular/core';
import { RunExecution } from '../../shared/openapi';
import ExecutionStatusEnum = RunExecution.ExecutionStatusEnum;

@Pipe({
  name: 'executionStatus',
})
export class ExecutionStatusPipe implements PipeTransform {
  /**
   * Transforms ExecutionStatusEnum into their display name
   * @param executionStatus
   * @returns {string}
   */
  transform(executionStatus: string): string {
    switch (executionStatus) {
      case ExecutionStatusEnum.ALL:
        return 'All Statuses';
      case ExecutionStatusEnum.SUCCESSFUL:
        return 'Successful';
      case ExecutionStatusEnum.ABORTED:
        return 'Aborted';
      case ExecutionStatusEnum.FAILED:
        return 'Failed';
      case ExecutionStatusEnum.FAILEDRUNTIMEINVALID:
        return 'Failed Runtime Invalid';
      case ExecutionStatusEnum.FAILEDSEMANTICINVALID:
        return 'Failed Semantic Invalid';
      default:
        return executionStatus;
    }
  }
}
