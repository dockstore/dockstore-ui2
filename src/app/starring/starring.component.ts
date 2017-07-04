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
    // get tool from the observer
    if (!this.workflow && !this.tool) {
      this.setupSubscription();
    } else {
      // get the tool from the input, used by the starred Page
      this.setupInputEntry();
    }
  }
  setupSubscription() {
    this.workflowSubscription = this.workflowService.workflow$.subscribe(
      workflow => {
        this.setupWorkflow(workflow);
      });
    this.toolSubscription = this.containerService.tool$.subscribe(
      tool => {
        this.setupTool(tool);
      });
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
    this.setupUserStarring();
    this.getStarredUsers();
  }
  setupWorkflow(workflow: any) {
    this.entry = workflow;
    this.entryType = 'workflows';
    this.setupUserStarring();
    this.getStarredUsers();
  }
  setupUserStarring() {
    if (!this.user) {
      this.loginSubscription = this.trackLoginService.isLoggedIn$.subscribe(
        state => {
          this.isLoggedIn = state;
          if (state) {
            this.userService.getUser().subscribe(user => {
              this.user = user;
              this.getStarring();
            });
          }
        });
    } else {
      this.getStarring();
    }
  }
  getStarring(): any {
    if (this.entry && this.entryType && this.user) {
      this.starringService.getStarring(this.entry.id, this.entryType).subscribe(
        starring => {
          let match = false;
          for (const star of starring) {
            if (star.id === this.user.id) {
              match = true;
              break;
            }
          }
          this.rate = match;
        });
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
