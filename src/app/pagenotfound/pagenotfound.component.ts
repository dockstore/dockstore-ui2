import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss'],
})
export class PageNotFoundComponent {
  Dockstore = Dockstore;
}
