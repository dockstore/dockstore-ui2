import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserQuery } from 'app/shared/user/user.query';
import { DefaultService } from 'app/shared/openapi';
import { OrganizationUpdateTime } from 'app/shared/openapi/model/organizationUpdateTime';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from 'app/shared/constants';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {
  public myOrganizations;
  public organizationFilterText;
  public hasOrganizations = false;
  public firstCall = true;
  userId$: Observable<number>;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private userQuery: UserQuery, private defaultService: DefaultService) {}

  ngOnInit() {
    this.userId$ = this.userQuery.userId$;
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyOrganizations();
    });
  }

  getMyOrganizations(): void {
    this.defaultService
      .getUserDockstoreOrganizations(10, this.organizationFilterText)
      .pipe(
        debounceTime(formInputDebounceTime),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myOrganizations: Array<OrganizationUpdateTime>) => {
          this.myOrganizations = myOrganizations;
          if (this.firstCall && this.myOrganizations && this.myOrganizations.length > 0) {
            this.hasOrganizations = true;
            this.firstCall = false;
          }
        },
        () => {}
      );
  }

  onTextChange(event: any) {
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyOrganizations();
    });
  }
}
