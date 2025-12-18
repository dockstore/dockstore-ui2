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
import { Temporal } from '@js-temporal/polyfill';

@Injectable()
export class TimeSeriesService {
  /**
   * Create a new time series by adding bins to the newer end of the specified time series so that it overlaps the specified date, and then adding/removing bins on the older end of the resulting time series to make it have the specified number of bins.
   */
  adjustTimeSeries(timeSeriesMetric: TimeSeriesMetric, now: Date, binCount: number): TimeSeriesMetric {
    const operations = this.createIntervalOperations(timeSeriesMetric);

    // Store information from the original time series in variables that we will adjust and then reassemble into a new time series at the end of this method.
    let begins = this.stringToTime(timeSeriesMetric.begins);
    let ends = this.stringToTime(timeSeriesMetric.ends);
    let values = timeSeriesMetric.values.slice();

    // Append bins to the newer end of the time series, if necessary, to make it overlap the specified date.
    const binsToAppend = operations.countIntervals(ends, this.dateToTime(now));
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
      begins: this.timeToString(begins),
      ends: this.timeToString(ends),
      interval: timeSeriesMetric.interval,
      values: values,
    };
  }

  private stringToTime(s: string): Temporal.ZonedDateTime {
    return Temporal.Instant.fromEpochMilliseconds(Number(s)).toZonedDateTimeISO('UTC');
  }

  private timeToString(t: Temporal.ZonedDateTime): string {
    return String(t.epochMilliseconds);
  }

  private dateToTime(d: Date) {
    return Temporal.Instant.fromEpochMilliseconds(d.getTime()).toZonedDateTimeISO('UTC');
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
    const begins = this.stringToTime(timeSeriesMetric.begins);
    return timeSeriesMetric.values.map((value, index) => {
      const when = operations.addIntervals(begins, index);
      return operations.label(when);
    });
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

/**
 * Encapsulates primitive operations that can be used to manipulate a time series with a particular interval.
 */
interface IntervalOperations {
  /**
   * Calculate the whole number of intervals by which the "from" time must be advanced to be later than the "to" time.
   * @param from start time in epoch milliseconds
   * @param to end time in epoch milliseconds
   */
  countIntervals(from: Temporal.ZonedDateTime, to: Temporal.ZonedDateTime): number;

  /**
   * Add the specified number of intervals to the specified "from" time.
   * @param from start time in epoch milliseconds
   * @param intervalCount number of intervals to add
   */
  addIntervals(from: Temporal.ZonedDateTime, intervalCount: number): Temporal.ZonedDateTime;

  /**
   * Subtract the specified number of intervals to the specified "from" time.
   * @param from start time in epoch milliseconds
   * @param intervalCount number of intervals to subtract
   */
  subtractIntervals(from: Temporal.ZonedDateTime, intervalCount: number): Temporal.ZonedDateTime;

  /**
   * Calculate a label for the time series bin that begins at the specified time.
   */
  label(begins: Temporal.ZonedDateTime): string;
}

/**
 * Implements primitive operations to manipulate a time series wherein each interval is one of the
 * accepted Temporal API units.
 */
abstract class UnitIntervalOperations implements IntervalOperations {
  unit: Temporal.DateTimeUnit;
  units: Temporal.PluralUnit<Temporal.DateTimeUnit>;
  constructor(unit: Temporal.DateTimeUnit, units: Temporal.PluralUnit<Temporal.DateTimeUnit>) {
    this.unit = unit;
    this.units = units;
  }

  countIntervals(from: Temporal.ZonedDateTime, to: Temporal.ZonedDateTime): number {
    if (Temporal.ZonedDateTime.compare(from, to) >= 0) {
      return 0;
    }
    return Math.ceil(from.until(to).total({ relativeTo: from, unit: this.unit }));
  }

  addIntervals(from: Temporal.ZonedDateTime, intervalCount: number): Temporal.ZonedDateTime {
    const duration = Temporal.Duration.from({ [this.units]: intervalCount });
    return from.add(duration);
  }

  subtractIntervals(from: Temporal.ZonedDateTime, intervalCount: number): Temporal.ZonedDateTime {
    const duration = Temporal.Duration.from({ [this.units]: intervalCount });
    return from.subtract(duration);
  }

  abstract label(begins: Temporal.ZonedDateTime): string;
}

/**
 * Implements primitive operations to manipulate a time series wherein the interval is DAY.
 */
class DayIntervalOperations extends UnitIntervalOperations {
  constructor() {
    super('day', 'days');
  }

  label(begins: Temporal.ZonedDateTime): string {
    // Calculate the time of the middle of the day, and create a label from it.
    const middle = begins.add(Temporal.Duration.from({ hours: 12 }));
    return isoYearMonthDay(middle);
  }
}

/**
 * Implements primitive operations to manipulate a time series wherein the interval is WEEK.
 */
class WeekIntervalOperations extends UnitIntervalOperations {
  constructor() {
    super('week', 'weeks');
  }

  label(begins: Temporal.ZonedDateTime): string {
    // Calculate the times that are midway through the first and last days of the week (by adding 0.5 and 6.5 days to the beginning time) and create a label from them.
    const firstDay = begins.add(Temporal.Duration.from({ hours: 12 }));
    const lastDay = begins.add(Temporal.Duration.from({ days: 6, hours: 12 }));
    return `${isoYearMonthDay(firstDay)} to ${isoYearMonthDay(lastDay)}`;
  }
}

/**
 * Implements primitive operations to manipulate a time series wherein the interval is MONTH.
 */
class MonthIntervalOperations extends UnitIntervalOperations {
  constructor() {
    super('month', 'months');
  }

  label(begins: Temporal.ZonedDateTime): string {
    // Calculate a time that is approximately the middle of the month, and create a label from it.
    const middle = begins.add(Temporal.Duration.from({ days: 15 }));
    return isoYearMonth(middle);
  }
}

class UnsupportedIntervalOperations implements IntervalOperations {
  countIntervals(from: Temporal.ZonedDateTime, to: Temporal.ZonedDateTime): number {
    return 0;
  }

  addIntervals(from: Temporal.ZonedDateTime, intervalCount: number): Temporal.ZonedDateTime {
    return from;
  }

  subtractIntervals(from: Temporal.ZonedDateTime, intervalCount: number): Temporal.ZonedDateTime {
    return from;
  }

  label(begins: Temporal.ZonedDateTime): string {
    return '';
  }
}

function isoYearMonthDay(when: Temporal.ZonedDateTime): string {
  return when.toString().slice(0, 10);
}

function isoYearMonth(when: Temporal.ZonedDateTime): string {
  return when.toString().slice(0, 7);
}
