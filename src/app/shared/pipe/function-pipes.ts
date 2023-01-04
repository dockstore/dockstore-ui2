import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'method',
})
export class MethodPipe implements PipeTransform {
  transform(thisValue: any, ...fnAndArgs: any): any {
    if (fnAndArgs.length < 1) {
      return null;
    }
    const fn = fnAndArgs[0];
    if (typeof fn !== 'function') {
      return null;
    }
    const args = fnAndArgs.slice(1);
    return fn.bind(thisValue)(...args);
  }
}

@Pipe({
  name: 'function',
})
export class FunctionPipe implements PipeTransform {
  transform(firstArg: any, ...thisFnAndOtherArgs: any): any {
    if (thisFnAndOtherArgs.length < 2) {
      return null;
    }
    const thisValue = thisFnAndOtherArgs[0];
    const fn = thisFnAndOtherArgs[1];
    if (typeof fn !== 'function') {
      return null;
    }
    const args = [firstArg, ...thisFnAndOtherArgs.slice(2)];
    return fn.bind(thisValue)(...args);
  }
}
