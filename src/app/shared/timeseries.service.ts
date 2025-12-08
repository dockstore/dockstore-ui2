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
  /**
   * Create a new time series by adding bins to the newer end of the specified time series so that it overlaps the specified date, and then adding/removing bins on the older end of the resulting time series to make it have the specified number of bins.
   */
  adjustTimeSeries(timeSeriesMetric: TimeSeriesMetric, now: Date, binCount: number): TimeSeriesMetric {
    const operations = this.createIntervalOperations(timeSeriesMetric);

    // Store information from the original time series in variables that we will adjust and then reassemble into a new time series at the end of this method.
    let begins = Number(timeSeriesMetric.begins);
    let ends = Number(timeSeriesMetric.ends);
    let values = timeSeriesMetric.values.slice();

    // Append bins to the newer end of the time series, if necessary, to make it overlap the specified date.
    const binsToAppend = operations.countIntervals(ends, now.getTime());
    if (binsToAppend > 0) {
      values = [...values, ...this.zeros(binsToAppend)];
      ends = operations.addIntervals(ends, binsToAppend);
    }

    // Prepend bins to the beginning (older end) of the time series, if necessary, to make its length match the desired bin count.
    const binsToPrepend = binCount - values.length;
    if (binsToPrepend > 0) {
      values = [...this.zeros(binsToPrepend), ...values];
      begins = operations.subtractIntervals(begins, binsToPrepend);
    }

    // Trim bins from the beginning (older end) of the time series, if necessary, to make its length match the desired bin count.
    const binsToTrim = values.length - binCount;
    if (binsToTrim > 0) {
      values = values.slice(binsToTrim);
      begins = operations.addIntervals(begins, binsToTrim);
    }

    return {
      begins: String(begins),
      ends: String(ends),
      interval: timeSeriesMetric.interval,
      values: values,
    };
  }

  /**
   * Create a new time series with all zero values and the same beginning time, ending time, and interval as the specified time series.
   */
  emptyTimeSeries(timeSeriesMetric: TimeSeriesMetric) {
    return {
      begins: timeSeriesMetric.begins,
      ends: timeSeriesMetric.ends,
      interval: timeSeriesMetric.interval,
      values: this.zeros(timeSeriesMetric.values.length),
    };
  }

  /**
   * Create a list of labels, one for each bin of the time series, starting with the oldest bin.
   */
  labelsFromTimeSeries(timeSeriesMetric: TimeSeriesMetric): string[] {
    const operations = this.createIntervalOperations(timeSeriesMetric);
    const labels: string[] = [];
    for (let i = 0; i < timeSeriesMetric.values.length; i++) {
      const when = operations.addIntervals(Number(timeSeriesMetric.begins), i);
      const label = operations.label(when);
      labels.push(label);
    }
    return labels;
  }

  private zeros(count: number): number[] {
    return new Array(count).fill(0);
  }

  /**
   * Create an instance of IntervalOperations that performs the appropriate operations for the specified time series.
   */
  private createIntervalOperations(timeSeriesMetric: TimeSeriesMetric): IntervalOperations {
    switch (timeSeriesMetric.interval) {
      case TimeSeriesMetric.IntervalEnum.DAY:
        return new DayIntervalOperations();
      case TimeSeriesMetric.IntervalEnum.WEEK:
        return new WeekIntervalOperations();
      case TimeSeriesMetric.IntervalEnum.MONTH:
        return new MonthIntervalOperations();
    }
    // If we can't support a time series with the given interval, return some operations that do nothing, instead of crashing/throwing/guessing.
    return new UnsupportedIntervalOperations();
  }
}

module TimeConstants {
  export const DAY_MILLIS = 24 * 60 * 60 * 1000;
  export const WEEK_MILLIS = 7 * DAY_MILLIS;
  export const AVERAGE_MONTH_MILLIS = (365.2425 / 12) * DAY_MILLIS;
}

/**
 * Encapsulates primitive operations that can be used to manipulate a time series with a particular interval.
 */
interface IntervalOperations {
  /**
   * Calculate the whole number of intervals by which the "from" time must be advanced to be later than the "to" time.
   * @param from start time in epoch milliseconds
   * @param to end time in epoch milliseconds
   */
  countIntervals(from: number, to: number): number;

  /**
   * Add the specified number of intervals to the specified "from" time.
   * @param from start time in epoch milliseconds
   * @param intervalCount number of intervals to add
   */
  addIntervals(from: number, intervalCount: number): number;

  /**
   * Subtract the specified number of intervals to the specified "from" time.
   * @param from start time in epoch milliseconds
   * @param intervalCount number of intervals to subtract
   */
  subtractIntervals(from: number, intervalCount: number): number;

  /**
   * Calculate a label for the time series bin that begins at the specified time.
   */
  label(begins: number): string;
}

/**
 * Implements primitive operations to manipulate a time series wherein each interval is always the exact same
 * duration (SECOND, MINUTE, HOUR, DAY, WEEK).  This class is not suitable for MONTH and YEAR intervals,
 * because the the duration of the interval depends upon the particular month (28 to 31 days) or year
 * (normal year or leap year).
 */
abstract class ConstantIntervalOperations implements IntervalOperations {
  durationMillis: number;
  constructor(durationMillis: number) {
    this.durationMillis = durationMillis;
  }

  countIntervals(from: number, to: number): number {
    return Math.ceil((to - from) / this.durationMillis);
  }

  addIntervals(from: number, intervalCount: number): number {
    return from + intervalCount * this.durationMillis;
  }

  subtractIntervals(from: number, intervalCount: number): number {
    return from - intervalCount * this.durationMillis;
  }

  abstract label(begins: number): string;
}

/**
 * Implements primitive operations to manipulate a time series wherein the interval is DAY.
 */
class DayIntervalOperations extends ConstantIntervalOperations {
  constructor() {
    super(TimeConstants.DAY_MILLIS);
  }

  label(begins: number): string {
    // Calculate the time of the middle of the day, and create a label from it.
    const middle = begins + 0.5 * TimeConstants.DAY_MILLIS;
    return isoYearMonthDay(new Date(middle));
  }
}

/**
 * Implements primitive operations to manipulate a time series wherein the interval is WEEK.
 */
class WeekIntervalOperations extends ConstantIntervalOperations {
  constructor() {
    super(TimeConstants.WEEK_MILLIS);
  }

  label(begins: number): string {
    // Calculate the times that are three days before and after the middle of the week, and create a label from them.
    const middle = begins + 0.5 * TimeConstants.WEEK_MILLIS;
    const firstDay: Date = new Date(middle - 3 * TimeConstants.DAY_MILLIS);
    const lastDay: Date = new Date(middle + 3 * TimeConstants.DAY_MILLIS);
    return isoYearMonthDay(firstDay) + ' to ' + isoYearMonthDay(lastDay);
  }
}

/**
 * Implements primitive operations to manipulate a time series wherein the interval is MONTH.
 * Months differ in length (from 28 to 31 days), so it is not possible to adjust time by MONTH intervals by
 * adding/subtracting the exact same amount of time for each month.
 */
class MonthIntervalOperations implements IntervalOperations {
  countIntervals(from: number, to: number): number {
    // Step 1: To efficiently skip forward by a large number of months, compute a slight underestimate of the true interval count, and advance the "from" time by that amount.
    // To avoid skipping too far forward, we must underestimate, because some months are shorter than average.
    let intervalCount = Math.max(Math.floor((to - from) / TimeConstants.AVERAGE_MONTH_MILLIS) - 2, 0);
    let when = this.addIntervals(from, intervalCount);
    // Step 2: Add more intervals, one by one, until we've reached the "to" time.
    // This step accounts for the remaining time due to the underestimate in the previous step.
    // For example, if the "to" time is in March 1, and "when" is January 3, we add 31 days to move to February 3, and then 28 days to move to March 3, and we're done.
    while (when < to) {
      when = this.addIntervals(when, 1);
      intervalCount++;
    }
    return intervalCount;
  }

  addIntervals(from: number, intervalCount: number): number {
    const date = new Date(from);
    date.setUTCMonth(date.getUTCMonth() + intervalCount);
    return date.getTime();
  }

  subtractIntervals(from: number, intervalCount: number): number {
    return this.addIntervals(from, -intervalCount);
  }

  label(begins: number): string {
    // Calculate the time of the middle of the month, and create a label from it.
    const middle = begins + 0.5 * TimeConstants.AVERAGE_MONTH_MILLIS;
    return isoYearMonth(new Date(middle));
  }
}

class UnsupportedIntervalOperations implements IntervalOperations {
  countIntervals(from: number, to: number): number {
    return 0;
  }

  addIntervals(from: number, intervalCount: number): number {
    return from;
  }

  subtractIntervals(from: number, intervalCount: number): number {
    return from;
  }

  label(begins: number): string {
    return '';
  }
}

function isoYearMonthDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isoYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}
