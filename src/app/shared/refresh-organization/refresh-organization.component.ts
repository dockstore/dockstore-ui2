import { StateService } from './../state.service';
import { UserService } from '../../loginComponents/user.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-refresh-organization',
  templateUrl: './refresh-organization.component.html',
  styleUrls: ['./refresh-organization.component.css']
})
export class RefreshOrganizationComponent implements OnInit {
  protected userId: number;
  @Input() protected organization: string;
  protected refreshMessage: string;
  constructor(private userService: UserService, protected stateService: StateService) {
  }

  ngOnInit() {
    this.userService.userId$.subscribe(userId => this.userId = userId);
    this.stateService.refreshMessage$.subscribe((refreshMessage: string) => this.refreshMessage = refreshMessage);
  }

  toDisable(): boolean {
    return this.refreshMessage !== null;
  }

}
