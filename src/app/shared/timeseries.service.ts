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
    // TODO make this work for monthly intervals, also.
    const day = 24 * 60 * 60 * 1000; // Milliseconds in one day (hours * minutes * seconds * milliseconds).
    const week = 7 * day;

    // Store information from the original time series in variables that we will adjust and then reassemble into a new time series at the end of this method.
    let begins = Number(timeSeriesMetric.begins);
    let ends = Number(timeSeriesMetric.ends);
    let values = timeSeriesMetric.values.slice();

    // Append bins to the newer end of the time series to make it overlap the specified date.
    const binsToAppend = Math.ceil((now.getTime() - ends) / week);
    if (binsToAppend > 0) {
      values = [...values, ...this.zeros(binsToAppend)];
      ends = ends + binsToAppend * week;
    }

    // Prepend bins to the older end of the time series to make its length match the desired bin count.
    const binsToPrepend = binCount - values.length;
    if (binsToPrepend > 0) {
      values = [...this.zeros(binsToPrepend), ...values];
      begins = begins - binsToPrepend * week;
    }

    // Trim bins from the older end of the time series to make its length match the desired bin count.
    const binsToTrim = values.length - binCount;
    if (binsToTrim > 0) {
      values = values.slice(binsToTrim);
      begins = begins + binsToTrim * week;
    }

    return {
      begins: String(begins),
      ends: String(ends),
      values: values,
      interval: timeSeriesMetric.interval,
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
    // TODO make this work for monthly time series, also.
    const day = 24 * 60 * 60 * 1000; // Milliseconds in one day (hours * minutes * seconds * milliseconds).
    const week = 7 * day;
    const halfWeek = week / 2;
    let begins = Number(timeSeriesMetric.begins);
    const labels: string[] = [];
    for (let i = 0; i < timeSeriesMetric.values.length; i++) {
      const middle = begins + i * week + halfWeek;
      const firstDay: Date = new Date(middle - 3 * day);
      const lastDay: Date = new Date(middle + 3 * day);
      const label = this.formatShortDate(firstDay) + ' to ' + this.formatShortDate(lastDay);
      labels.push(label);
    }
    return labels;
  }

  private formatShortDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private zeros(count: number): number[] {
    return new Array(count).fill(0);
  }
}
