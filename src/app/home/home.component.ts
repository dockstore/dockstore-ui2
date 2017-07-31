import {AfterViewInit, Component, OnInit} from '@angular/core';
import { TwitterService } from '../shared/twitter.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  constructor(private twitterService: TwitterService) {
  }

  ngOnInit() {
    (<any>$('.youtube')).colorbox({iframe: true, innerWidth: 640, innerHeight: 390});
  }
  ngAfterViewInit() {
    this.twitterService.runScript();
  }
}
