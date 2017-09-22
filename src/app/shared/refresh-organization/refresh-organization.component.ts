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
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.userId$.subscribe(userId => this.userId = userId);
  }

}
