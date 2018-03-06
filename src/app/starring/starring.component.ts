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

import { User } from './../shared/swagger/model/user';
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { UserService } from '../loginComponents/user.service';
import { Subscription } from 'rxjs/Subscription';
import { WorkflowService } from '../shared/workflow.service';
import { ContainerService } from '../shared/container.service';
import { TrackLoginService } from '../shared/track-login.service';
import { StarringService } from './starring.service';
import { StarentryService } from '../shared/starentry.service';

@Component({
  selector: 'app-starring',
  templateUrl: './starring.component.html',
  styleUrls: ['./starring.component.css']
})
export class StarringComponent implements OnInit {
  @Input() tool: any;
  @Input() workflow: any;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();
  user: any;
  entry: any;
  entryType: string;
  isLoggedIn: boolean;
  rate: boolean;
  total_stars = 0;
  private starredUsers: User[];
  private workflowSubscription: Subscription;
  private toolSubscription: Subscription;
  private loginSubscription: Subscription;
  constructor(private trackLoginService: TrackLoginService,
              private userService: UserService,
              private workflowService: WorkflowService,
              private containerService: ContainerService,
              private starringService: StarringService,
              private starentryService: StarentryService) { }

  ngOnInit() {
    this.trackLoginService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    // get tool from the observer
    if (this.workflow || this.tool) {
      // get the tool from the input, used by the starred Page and entry components
      this.setupInputEntry();
    }
    this.userService.user$.subscribe(user => this.user = user);
  }

  setupInputEntry() {
    if (this.tool) {
      this.setupTool(this.tool);
    }
    if (this.workflow) {
      this.setupWorkflow(this.workflow);
    }
  }

  setupTool(tool: any) {
    this.entry = tool;
    this.entryType = 'containers';
    this.getStarredUsers();
  }
  setupWorkflow(workflow: any) {
    this.entry = workflow;
    this.entryType = 'workflows';
    this.getStarredUsers();
  }

  calculateRate(starredUsers: User[]) {
    if (!this.user) {
      this.rate = false;
    } else {
    let matchingUser: User;
    matchingUser = starredUsers.find(user => user.id === this.user.id);
    if (matchingUser) {
      this.rate = true;
    } else {
      this.rate = false;
    }
  }
  }

  setStarring() {
    this.rate = !this.rate;
    if (this.isLoggedIn) {
      this.setStar().subscribe(
        data => {
          // update total_start
          this.getStarredUsers();
        });
    }
  }
  setStar(): any {
    if (!this.rate) {
      return this.starringService.setUnstar(this.entry.id, this.entryType);
    } else {
      return this.starringService.setStar(this.entry.id, this.entryType);
    }
  }
  getStarredUsers(): any {
    if (this.entry && this.entryType) {
      this.starringService.getStarring(this.entry.id, this.entryType).subscribe(
        starring => {
          this.total_stars = starring.length;
          this.calculateRate(starring);
        });
    }
  }
  getStargazers(entry, entryType) {
    const selectedEntry = {
      theEntry: entry,
      theEntryType: entryType
    };
    this.starentryService.setEntry(selectedEntry);
    this.change.emit();
  }
}
