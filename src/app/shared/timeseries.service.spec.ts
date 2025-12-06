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
import { inject, TestBed } from '@angular/core/testing';
import { dailyTimeSeries, weeklyTimeSeries, monthlyTimeSeries } from '../test/mocked-objects';
import { TimeSeriesMetric } from './openapi/model/timeSeriesMetric';
import { TimeSeriesService } from './timeseries.service';

/*
 * The values coded into the following tests derive from the current mock TimeSeriesMetric values.
 * If you change the values of the mocks, you will need to adjust these tests.
 */

describe('TimeSeriesService', () => {
  const DAY_MILLIS = 24 * 3600 * 1000;
  const WEEK_MILLIS = 7 * DAY_MILLIS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeSeriesService],
    });
  });

  it('should be created', inject([TimeSeriesService], (service: TimeSeriesService) => {
    expect(service).toBeTruthy();
  }));

  it('should adjust daily timeseries correctly', inject([TimeSeriesService], (service: TimeSeriesService) => {
    const begins = Number(dailyTimeSeries.begins);
    const ends = Number(dailyTimeSeries.ends);
    const adjusted = service.adjustTimeSeries(dailyTimeSeries, new Date(ends + 1), 5);
    expect(Number(adjusted.begins)).toEqual(begins - 2 * DAY_MILLIS);
    expect(Number(adjusted.ends)).toEqual(ends + DAY_MILLIS);
    expect(adjusted.values).toEqual([0, 0, 1, 2, 0]);
    expect(adjusted.interval).toEqual(dailyTimeSeries.interval);
    checkNoAdjustment(service, dailyTimeSeries);
  }));

  it('should adjust weekly timeseries correctly', inject([TimeSeriesService], (service: TimeSeriesService) => {
    const begins = Number(weeklyTimeSeries.begins);
    const ends = Number(weeklyTimeSeries.ends);
    const adjusted = service.adjustTimeSeries(weeklyTimeSeries, new Date(ends + 1), 3);
    expect(Number(adjusted.begins)).toEqual(begins + WEEK_MILLIS);
    expect(Number(adjusted.ends)).toEqual(ends + WEEK_MILLIS);
    expect(adjusted.values).toEqual([2, 3, 0]);
    expect(adjusted.interval).toEqual(weeklyTimeSeries.interval);
    checkNoAdjustment(service, weeklyTimeSeries);
  }));

  it('should adjust monthly timeseries correctly', inject([TimeSeriesService], (service: TimeSeriesService) => {
    // The mock "begins" time is late on Dec 5, 2025, and the mock "ends" time is one month later.
    const begins = Number(monthlyTimeSeries.begins);
    const ends = Number(monthlyTimeSeries.ends);
    // Adjust the time series to a "now" date about 5.5 months from the current end of the time series, causing the adjusted "ends" time to move 6 months into the future.
    const adjusted = service.adjustTimeSeries(monthlyTimeSeries, new Date(ends + 5.5 * 30 * DAY_MILLIS), 12);
    // The adjusted "begins" time should be earlier by the length of July through November 2025.
    expect(Number(adjusted.begins)).toEqual(begins - (31 + 30 + 31 + 31 + 30) * DAY_MILLIS);
    // The adjusted "ends" time should be later by the length of January through June 2026.
    expect(Number(adjusted.ends)).toEqual(ends + (31 + 28 + 31 + 30 + 31 + 30) * DAY_MILLIS);
    expect(adjusted.values).toEqual([0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]);
    expect(adjusted.interval).toEqual(monthlyTimeSeries.interval);
    checkNoAdjustment(service, monthlyTimeSeries);
  }));

  function checkNoAdjustment(service: TimeSeriesService, timeSeries: TimeSeriesMetric) {
    const adjusted = service.adjustTimeSeries(timeSeries, new Date(Number(timeSeries.ends) - 1), timeSeries.values.length);
    expect(adjusted.begins).toEqual(timeSeries.begins);
    expect(adjusted.ends).toEqual(timeSeries.ends);
    expect(adjusted.values).toEqual(timeSeries.values);
    expect(adjusted.interval).toEqual(timeSeries.interval);
  }
});
