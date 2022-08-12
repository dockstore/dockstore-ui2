import { Component, OnInit } from '@angular/core';
import { Base } from 'app/shared/base';
import { takeUntil } from 'rxjs/operators';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterToolComponent } from 'app/container/register-tool/register-tool.component';
import { AlertService } from 'app/shared/alert/state/alert.service';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
})
export class NewDashboardComponent extends Base implements OnInit {
  constructor(private registerToolService: RegisterToolService, private dialog: MatDialog, private alertService: AlertService) {
    super();
  }

  ngOnInit() {
    this.registerToolService.isModalShown.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isModalShown: boolean) => {
      if (isModalShown) {
        const dialogRef = this.dialog.open(RegisterToolComponent, { width: '500px' });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.alertService.clearEverything();
          });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
