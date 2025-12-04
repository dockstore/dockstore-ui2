/*
 *     Copyright 2025 OICR and UCSC
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Injectable } from '@angular/core';
import { TimeSeriesMetric } from './openapi';

@Injectable()
export class TimeSeriesService {
  adjustTimeSeries(timeSeriesMetric: TimeSeriesMetric, now: Date, binCount: number): TimeSeriesMetric {
    const ops = this.createIntervalOps(timeSeriesMetric);

    // Store information from the original time series in variables that we will adjust and then reassemble into a new time series at the end of this method.
    let begins = Number(timeSeriesMetric.begins);
    let ends = Number(timeSeriesMetric.ends);
    let values = timeSeriesMetric.values.slice();

    // Append bins to the newer end of the time series to make it overlap the specified date.
    const binsToAppend = ops.countIntervals(ends, now.getTime());
    if (binsToAppend > 0) {
      values = [...values, ...this.zeros(binsToAppend)];
      ends = ops.addIntervals(ends, binsToAppend);
    }

    // Prepend bins to the beginning (older end) of a "short" time series to make its length match the desired bin count.
    const binsToPrepend = binCount - values.length;
    if (binsToPrepend > 0) {
      values = [...this.zeros(binsToPrepend), ...values];
      begins = ops.subtractIntervals(begins, binsToPrepend);
    }

    // Trim bins from the beginning (older end) of a "long" time series to make its length match the desired bin count.
    const binsToTrim = values.length - binCount;
    if (binsToTrim > 0) {
      values = values.slice(binsToTrim);
      begins = ops.addIntervals(begins, binsToTrim);
    }

    return {
      begins: String(begins),
      ends: String(ends),
      interval: timeSeriesMetric.interval,
      values: values,
    };
  }

  emptyTimeSeries(timeSeriesMetric: TimeSeriesMetric) {
    return {
      begins: timeSeriesMetric.begins,
      ends: timeSeriesMetric.ends,
      interval: timeSeriesMetric.interval,
      values: this.zeros(timeSeriesMetric.values.length),
    };
  }

  labelsFromTimeSeries(timeSeriesMetric: TimeSeriesMetric): string[] {
    const ops = this.createIntervalOps(timeSeriesMetric);
    return ops.labels(Number(timeSeriesMetric.begins), timeSeriesMetric.values.length);
  }

  private zeros(count: number): number[] {
    return new Array(count).fill(0);
  }

  private createIntervalOps(timeSeriesMetric: TimeSeriesMetric): IntervalOps {
    return new WeeklyIntervalOps();
  }
}

module TimeConstants {
  export const DAY_MILLIS = 24 * 60 * 60 * 1000;
  export const WEEK_MILLIS = 7 * DAY_MILLIS;
}

interface IntervalOps {
  countIntervals(from: number, to: number): number;
  addIntervals(from: number, intervalCount: number): number;
  subtractIntervals(from: number, intervalCount: number): number;
  labels(begins: number, length: number): string[];
}

class WeeklyIntervalOps implements IntervalOps {
  countIntervals(from: number, to: number): number {
    return Math.ceil((to - from) / TimeConstants.WEEK_MILLIS);
  }

  addIntervals(from: number, intervalCount: number): number {
    return from + intervalCount * TimeConstants.WEEK_MILLIS;
  }

  subtractIntervals(from: number, intervalCount: number): number {
    return from - intervalCount * TimeConstants.WEEK_MILLIS;
  }

  labels(from: number, length: number): string[] {
    const labels: string[] = [];
    for (let i = 0; i < length; i++) {
      const middle = from + (i + 0.5) * TimeConstants.WEEK_MILLIS;
      const firstDay: Date = new Date(middle - 3 * TimeConstants.DAY_MILLIS);
      const lastDay: Date = new Date(middle + 3 * TimeConstants.DAY_MILLIS);
      const label = isoYearMonthDay(firstDay) + ' to ' + isoYearMonthDay(lastDay);
      labels.push(label);
    }
    return labels;
  }
}

function isoYearMonthDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/*
function isoYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}
*/
