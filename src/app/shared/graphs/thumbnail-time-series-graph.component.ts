import { Component, Input, OnChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { TimeSeriesMetric } from '../openapi';

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

  constructor() {}

  ngOnChanges(): void {
    this.datasets = undefined;
    this.options = undefined;
    // if (this.timeSeries && this.now && this.binCount && this.maxValue) {
    this.datasets = {
      datasets: [{ data: [1, 3, 5, 7, 2, 4, 3, 5, 1, 3, 5] }],
      labels: ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z', 's', 't', 'u'],
    };
    this.options = {
      plugins: { legend: { display: false } },
      fill: true,
      backgroundColor: 'rgb(72, 121, 128)',
      scales: {
        x: { ticks: { display: false }, grid: { tickLength: 0 } },
        y: { min: 0, max: 10, ticks: { display: false }, grid: { tickLength: 0 } },
      },
      responsive: false,
      animation: false,
    };
    // }
  }
}
