import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHoursMinutesSeconds',
})
export class SecondsToHoursMinutesSecondsPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    if (totalSeconds || totalSeconds === 0) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return this.formatNumber(hours) + ':' + this.formatNumber(minutes) + ':' + this.formatNumber(seconds);
    }
    return '';
  }

  private formatNumber(num: number): string {
    return formatNumber(num, 'en-US', '2.0-0');
  }
}
