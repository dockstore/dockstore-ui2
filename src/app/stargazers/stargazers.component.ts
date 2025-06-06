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
import { Component, OnInit } from '@angular/core';
import { StarEntry } from 'app/starring/StarEntry';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { altAvatarImg } from '../shared/constants';
import { User } from '../shared/openapi';
import { StarentryService } from '../shared/starentry.service';
import { UserService } from '../shared/user/user.service';
import { StarringService } from '../starring/starring.service';
import { RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-stargazers',
  templateUrl: './stargazers.component.html',
  styleUrls: ['./stargazers.component.css'],
  standalone: true,
  imports: [NgIf, MatCardModule, MatIconModule, FlexModule, NgFor, RouterLink],
})
export class StargazersComponent extends Base implements OnInit {
  starGazers: User[];
  public altAvatarImg = altAvatarImg;

  constructor(private starringService: StarringService, private userService: UserService, private starentryService: StarentryService) {
    super();
  }

  ngOnInit() {
    this.starentryService.starEntry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entry: StarEntry) => {
      if (entry && entry.theEntry) {
        this.starringService.getStarring(entry.theEntry.id, entry.theEntryType).subscribe((starring) => {
          this.starGazers = starring;
          this.starGazers.forEach((user) => {
            user.avatarUrl = this.userService.gravatarUrl(user.avatarUrl);
          });
        });
      }
    });
  }
}
