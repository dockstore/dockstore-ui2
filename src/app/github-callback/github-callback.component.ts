import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Base } from 'app/shared/base';
import { ActivatedRoute } from 'app/test';
import { takeUntil } from 'rxjs/operators';
import { GithubCallbackService } from './github-callback.service';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-github-callback',
  templateUrl: './github-callback.component.html',
  styleUrls: ['./github-callback.component.scss'],
  standalone: true,
  imports: [FlexModule, MatLegacyProgressSpinnerModule],
})
export class GithubCallbackComponent extends Base implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: GithubCallbackService) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((queryParams: Params | null) => this.router.resolveQueryParam(queryParams));
  }
}
