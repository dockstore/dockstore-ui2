import { Tracking } from './tracking';
import { Component, AfterViewInit } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
  }

  ngAfterViewInit() {
    document.write(Tracking.googleAnalytics);
    document.write(Tracking.googleTagManager);
  }
}
