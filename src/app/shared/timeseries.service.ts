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
    const adjusted: TimeSeriesMetric = {
      begins: timeSeriesMetric.begins,
      interval: timeSeriesMetric.interval,
      values: timeSeriesMetric.values.slice(),
    };

    // TODO make this work for daily intervals, also.
    const day = 24 * 60 * 60 * 1000; // milliseconds in one day (hours * minutes * seconds * milliseconds)
    const week = 7 * day;
    let begins = Number(adjusted.begins); // Midpoint of the oldest bin
    const ends = begins + (adjusted.values.length - 1) * week + week / 2; // Exact time that the youngest bin ends

    // Expand the newer end of the time series to overlap the current date
    const binsToAppend = Math.ceil((now.getTime() - ends) / week);
    if (binsToAppend > 0) {
      adjusted.values = [...adjusted.values, ...this.zeros(binsToAppend)];
    }

    // Expand the older end of the time series to match the desired bin count
    const binsToPrepend = binCount - adjusted.values.length;
    if (binsToPrepend > 0) {
      adjusted.values = [...this.zeros(binsToPrepend), ...adjusted.values];
      begins = begins - binsToPrepend * week;
    }

    // Trim the older end of the time series to match the desired bin count
    const binsToTrim = adjusted.values.length - binCount;
    if (binsToTrim > 0) {
      adjusted.values = adjusted.values.slice(binsToTrim);
      begins = begins + binsToTrim * week;
    }

    adjusted.begins = String(begins);
    return adjusted;
  }

  emptyTimeSeries(timeSeriesMetric: TimeSeriesMetric) {
    return {
      begins: timeSeriesMetric.begins,
      interval: timeSeriesMetric.interval,
      values: this.zeros(timeSeriesMetric.values.length),
    };
  }

  labelsFromTimeSeries(timeSeriesMetric: TimeSeriesMetric): string[] {
    // TODO make this work for daily time series, also.
    const day = 24 * 60 * 60 * 1000; // milliseconds in one day (hours * minutes * seconds * milliseconds)
    const week = 7 * day;
    let begins = Number(timeSeriesMetric.begins);
    const labels: string[] = [];
    for (let i = 0; i < timeSeriesMetric.values.length; i++) {
      const middle = begins + i * week;
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
