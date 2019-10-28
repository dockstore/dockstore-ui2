import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserQuery } from 'app/shared/user/user.query';
import { DefaultService } from 'app/shared/openapi';
import { OrganizationUpdateTime } from 'app/shared/openapi/model/organizationUpdateTime';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {
  public myOrganizations;
  public organizationFilterText;
  userId$: Observable<number>;

  constructor(private userQuery: UserQuery, private defaultService: DefaultService) {}

  ngOnInit() {
    this.userId$ = this.userQuery.userId$;
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyOrganizations(userId);
    });
  }

  getMyOrganizations(userId: number): void {
    this.defaultService.getUserDockstoreOrganizations(userId, 10, this.organizationFilterText).subscribe(
      (myOrganizations: Array<OrganizationUpdateTime>) => {
        this.myOrganizations = myOrganizations;
      },
      () => {}
    );
  }

  onTextChange(event: any) {
    this.userQuery.userId$.subscribe((userId: number) => {
      this.getMyOrganizations(userId);
    });
  }
}
