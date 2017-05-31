import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  constructor() {
  }

  ngOnInit() {
    (<any>$('.youtube')).colorbox({iframe: true, innerWidth: 640, innerHeight: 390});
  }




}
