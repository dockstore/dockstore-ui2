import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-sidebar',
  templateUrl: './my-sidebar.component.html',
  styleUrls: ['./my-sidebar.component.scss'],
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
})
export class MySidebarComponent {
  Dockstore = Dockstore;
}
