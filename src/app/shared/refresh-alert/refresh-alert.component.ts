import { StateService } from '../state.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refresh-alert',
  templateUrl: './refresh-alert.component.html',
  styleUrls: ['./refresh-alert.component.css']
})
export class RefreshAlertComponent implements OnInit {
  public refreshMessage: string;
  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
  }

}
