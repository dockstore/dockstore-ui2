import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  constructor() {
  }

  ngOnInit() {
    (<any>$('.youtube')).colorbox({iframe: true, innerWidth: 640, innerHeight: 390});
  }
  ngAfterViewInit() {
    const doc = document;
    const script = 'script';
    const id = 'twitter-wjs';
    let js: any;
    const scriptElement = doc.getElementsByTagName(script)[0];
    js = doc.createElement(script);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    scriptElement.parentNode.insertBefore(js, scriptElement);
  }
}
