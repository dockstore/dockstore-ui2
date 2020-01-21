import { Component } from '@angular/core';
import { Dockstore } from '../../../shared/dockstore.model';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent {
  Dockstore = Dockstore;
}
