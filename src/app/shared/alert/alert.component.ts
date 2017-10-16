import { ErrorService } from '../../shared/error.service';
import { StateService } from '../state.service';
import { Component, OnInit } from '@angular/core';

// TODO: Rename this component to something like 'alert' since it contains both error and refresh alerts

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  public refreshMessage: string;
  public errorObj: any;
  constructor(private stateService: StateService, private errorService: ErrorService) { }

  ngOnInit() {
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.errorService.errorObj$.subscribe(errorObj => this.errorObj = errorObj);
  }

  clearError() {
    this.errorService.setErrorAlert(null);
  }

}
