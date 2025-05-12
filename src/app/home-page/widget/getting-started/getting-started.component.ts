import { Component } from '@angular/core';
import { Dockstore } from '../../../shared/dockstore.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule],
})
export class GettingStartedComponent {
  Dockstore = Dockstore;
}
