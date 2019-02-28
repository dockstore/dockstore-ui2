import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {StarRequest, User} from '../../../shared/swagger';
import {TrackLoginService} from '../../../shared/track-login.service';
import {UserQuery} from '../../../shared/user/user.query';
import {ContainerService} from '../../../shared/container.service';
import {StarringService} from '../../../starring/starring.service';
import {StarentryService} from '../../../shared/starentry.service';
import {StarOrganizationService} from '../../../shared/star-organization.service';
import {AlertService} from '../../../shared/alert/state/alert.service';
import {first, takeUntil} from 'rxjs/operators';
import {Observable, of as ObservableOf, Subject} from 'rxjs';
import {OrganizationStarringService} from './organization-starring.service';

@Component({
  selector: 'app-organization-starring',
  templateUrl: './organization-starring.component.html',
  styleUrls: ['./organization-starring.component.scss']
})
export class OrganizationStarringComponent implements OnInit, OnDestroy, OnChanges {

  @Input() organization: any;
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();
  private user: any;
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
              private starOrganizationService: StarOrganizationService,
              private organizationStarringService: OrganizationStarringService,
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
    if (this.organization) {
      this.setUpOrganization(this.organization);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setUpOrganization(organization: any) {
    this.organization = organization;
    this.getStarredUsers();
  }

  // Determine if user has starred organization.
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

      if (this.rate) {
        const message = 'Unstarring ' + this.organization.name;
        this.alertService.start(message);
      } else {
        const message = 'Starring ';
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


  unstarOrg(organizationID: number): any {
    console.log('Unstarred');
    return 'Unstarred org';
  }

  starOrg(organizationID: number): any {
    const body: StarRequest = {
      star: true
    };
    console.log('Starred');
    return 'Starred org';
  }


  setStar(): any {
    if (this.rate) {
      return this.organizationStarringService.setUnstar(this.organization.id);
    } else {
      return this.organizationStarringService.setStar(this.organization.id);
    }
    // if (this.rate) {
    //   return this.unstarOrg(this.organization);
    //   // return this.starringService.setUnstar(this.entry.id, this.entryType);
    // } else {
    //   return this.starOrg(this.organization);
    //   // return this.starringService.setStar(this.entry.id, this.entryType);
    // }
  }
  getStarredUsers(): any {
    if (this.organization) {
      this.organizationStarringService.getStarring(this.organization.id).pipe(first()).subscribe(
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
    const selectedOrganization = {
      theOrganization: this.organization,
    };
    this.starOrganizationService.setOrganization(selectedOrganization);
    this.change.emit();
  }

  getStarring(organizationID: number): Observable<Array<User>> {
    // return this.workflowsService.getStarredUsers(entryID);
    return ObservableOf(this.starredUsers);
  }
}
