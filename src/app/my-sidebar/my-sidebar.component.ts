import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';

@Component({
  selector: 'app-my-sidebar',
  templateUrl: './my-sidebar.component.html',
  styleUrls: ['./my-sidebar.component.scss'],
})
export class MySidebarComponent {
  Dockstore = Dockstore;
}
