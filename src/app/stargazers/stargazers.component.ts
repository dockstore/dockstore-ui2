import {Component, Input, OnInit} from '@angular/core';
import { StarringService } from '../starring/starring.service';
import { UserService } from '../loginComponents/user.service';
import {Subscription} from 'rxjs/Subscription';
import { StarentryService } from '../shared/starentry.service';
@Component({
  selector: 'app-stargazers',
  templateUrl: './stargazers.component.html',
  styleUrls: ['./stargazers.component.css'],

})
export class StargazersComponent implements OnInit {
  starGazers: any;
  private entrySubscription: Subscription;
  constructor(private starringService: StarringService,
              private userService: UserService,
              private starentryService: StarentryService) {}

  ngOnInit() {
    this.entrySubscription = this.starentryService.starEntry$.subscribe(
      entry => {
        if (entry && entry.theEntry) {
          this.starringService.getStarring(entry.theEntry.id, entry.theEntryType).subscribe(
            starring => {
              this.starGazers = starring;
              this.starGazers.forEach(
                user => {
                  user.avatarUrl = this.userService.gravatarUrl(user.email, user.avatarUrl);
                });
            });
        }
      }
    );
  }

}
