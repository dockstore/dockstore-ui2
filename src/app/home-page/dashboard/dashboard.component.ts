import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Base } from 'app/shared/base';
import { takeUntil } from 'rxjs/operators';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { RegisterToolComponent } from 'app/container/register-tool/register-tool.component';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { Dockstore } from 'app/shared/dockstore.model';
import { bootstrap4largeModalSize } from '../../shared/constants';
import { EntryType } from '../../shared/openapi';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends Base implements OnInit {
  public Dockstore = Dockstore;
  @ViewChild('twitter') twitterElement: ElementRef;
  constructor(private registerToolService: RegisterToolService, private dialog: MatDialog, private alertService: AlertService) {
    super();
  }

  ngOnInit() {
    this.registerToolService.isModalShown.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isModalShown: boolean) => {
      if (isModalShown) {
        const dialogRef = this.dialog.open(RegisterToolComponent, { width: bootstrap4largeModalSize });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.alertService.clearEverything();
            this.registerToolService.setIsModalShown(false);
          });
      } else {
        this.dialog.closeAll();
      }
    });
  }

  protected readonly EntryType = EntryType;
}
