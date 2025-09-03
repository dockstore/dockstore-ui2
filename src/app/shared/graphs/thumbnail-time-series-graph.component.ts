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
    if (this.timeSeries && this.now && this.binCount && this.maxValue) {
      const adjusted = this.timeSeriesService.adjustTimeSeries(this.timeSeries, this.now, this.binCount);
      const values = adjusted.values;
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
            },
          },
          y: {
            min: 0,
            max: this.maxValue,
            ticks: {
              display: false,
            },
            grid: {
              tickLength: 0,
            },
          },
        },
        tooltips: {
          enabled: false,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: false,
        animation: false,
      };
    }
  }
}
