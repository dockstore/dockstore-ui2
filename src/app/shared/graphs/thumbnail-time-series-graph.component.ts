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
import { Component, Input, OnChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { TimeSeriesMetric } from '../openapi';
import { TimeSeriesService } from '../timeseries.service';

@Component({
  selector: 'app-thumbnail-time-series-graph',
  templateUrl: './thumbnail-time-series-graph.component.html',
  standalone: true,
  imports: [NgIf, BaseChartDirective],
})
export class ThumbnailTimeSeriesGraphComponent implements OnChanges {
  @Input() timeSeries: TimeSeriesMetric;
  @Input() now: Date;
  @Input() binCount: number;
  @Input() maxValue: number;
  datasets: any;
  options: any;

  constructor(private timeSeriesService: TimeSeriesService) {}

  ngOnChanges(): void {
    this.datasets = undefined;
    this.options = undefined;
    if (this.timeSeries != undefined) {
      let values;
      if (this.now != undefined && this.binCount != undefined) {
        values = this.timeSeriesService.adjustTimeSeries(this.timeSeries, this.now, this.binCount).values;
      } else {
        values = this.timeSeries.values;
      }
      const labels = new Array(values.length).fill('');
      this.datasets = {
        datasets: [{ data: values }],
        labels: labels,
      };
      this.options = {
        backgroundColor: 'rgb(72, 121, 128)',
        fill: true,
        scales: {
          x: {
            ticks: {
              display: false,
            },
            grid: {
              tickLength: 0,
              color: '#ddd',
            },
          },
          y: {
            min: 0,
            max: Math.max(this.maxValue ?? Math.max(...values), 1),
            ticks: {
              display: false,
            },
            grid: {
              tickLength: 0,
              color: '#ddd',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        responsive: false,
        animation: false,
      };
    }
  }
}
