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
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { ContainerService } from '../shared/container.service';
import { StarentryService } from '../shared/starentry.service';
import { User } from '../shared/swagger/model/user';
import { TrackLoginService } from '../shared/track-login.service';
import { UserQuery } from '../shared/user/user.query';
import { StarringService } from './starring.service';
import { AlertService } from '../shared/alert/state/alert.service';

@Component({
  selector: 'app-starring',
  templateUrl: './starring.component.html',
  styleUrls: ['./starring.component.css']
})
export class StarringComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tool: any;
  @Input() workflow: any;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();
  private user: any;
  private entry: any;
  private entryType: string;
  public isLoggedIn: boolean;
  public rate = false;
  public total_stars = 0;
  public disable = false;
  private ngUnsubscribe: Subject<{}> = new Subject();
  private starredUsers: User[];
  constructor(private trackLoginService: TrackLoginService,
    private userQuery: UserQuery,
    private containerService: ContainerService,
    private starringService: StarringService,
    private starentryService: StarentryService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.trackLoginService.isLoggedIn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    // get tool from the observer
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.user = user;
      this.rate = this.calculateRate(this.starredUsers);
    });
  }

  ngOnChanges() {
    if (this.workflow || this.tool) {
      // get the tool from the input, used by the starred Page and entry components
      this.setupInputEntry();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  calculateRate(starredUsers: User[]): boolean {
    if (!this.user || !starredUsers) {
      return false;
    } else {
      let matchingUser: User;
      if (!starredUsers) {
        return false;
      }
      matchingUser = starredUsers.find(user => user.id === this.user.id);
      if (matchingUser) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Handles the star button being clicked
   *
   * @memberof StarringComponent
   */
  setStarring() {
    this.disable = true;
    if (this.isLoggedIn) {
      const type = this.entryType === 'workflows' ? 'workflow' : 'tool';

      if (this.rate) {
        const message = 'Unstarring ' + type;
        this.alertService.start(message);
      } else {
        const message = 'Starring ' + type;
        this.alertService.start(message);
      }

      this.setStar().subscribe(
        data => {
          // update total_stars
          this.alertService.simpleSuccess();
          this.getStarredUsers();

        },
        (error) => {
          this.alertService.detailedError(error);
          this.disable = false;
        });
    }
  }
  setStar(): any {
    if (this.rate) {
      return this.starringService.setUnstar(this.entry.id, this.entryType);
    } else {
      return this.starringService.setStar(this.entry.id, this.entryType);
    }
  }
  getStarredUsers(): any {
    if (this.entry && this.entryType) {
      this.starringService.getStarring(this.entry.id, this.entryType).pipe(first()).subscribe(
        (starring: User[]) => {
          this.total_stars = starring.length;
          this.starredUsers = starring;
          this.rate = this.calculateRate(starring);
          this.disable = false;
        }, error => this.disable = false);
    } else {
      this.disable = false;
    }
  }
  getStargazers() {
    const selectedEntry = {
      theEntry: this.entry,
      theEntryType: this.entryType
    };
    this.starentryService.setEntry(selectedEntry);
    this.change.emit();
  }
}
