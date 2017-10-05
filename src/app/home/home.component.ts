import { Dockstore } from './../shared/dockstore.model';
import { environment } from './../../environments/environment';
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
  public prod = environment.production;
  constructor(private twitterService: TwitterService) {
  }

  ngOnInit() {
    (<any>$('.youtube')).colorbox({iframe: true, innerWidth: 640, innerHeight: 390});
  }
  ngAfterViewInit() {
    this.twitterService.runScript();
  }

  goToSearch(searchValue: string) {
    window.location.href = '/search?search=' + searchValue;
  }

  goToUI1() {
    window.location.href = Dockstore.UI1_URI;
  }
}
