/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
  protected refreshing: boolean;
  constructor(private userService: UserService, protected stateService: StateService) {
  }

  ngOnInit() {
    this.userService.userId$.subscribe(userId => this.userId = userId);
    this.stateService.refreshing.subscribe((refreshing: boolean) => this.refreshing = refreshing);
  }

  toDisable(): boolean {
    return this.refreshing;
  }

}
