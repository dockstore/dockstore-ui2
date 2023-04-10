import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Base } from 'app/shared/base';
import { takeUntil } from 'rxjs/operators';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterToolComponent } from 'app/container/register-tool/register-tool.component';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { TwitterService } from 'app/shared/twitter.service';
import { Dockstore } from 'app/shared/dockstore.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends Base implements OnInit {
  public Dockstore = Dockstore;
  @ViewChild('twitter') twitterElement: ElementRef;
  constructor(
    private registerToolService: RegisterToolService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private twitterService: TwitterService
  ) {
    super();
  }

  ngOnInit() {
    this.loadTwitterWidget();
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

  private loadTwitterWidget() {
    this.twitterService
      .loadScript()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.twitterService.createTimeline(this.twitterElement, 2);
        },
        (error) => console.error(error)
      );
  }
}
