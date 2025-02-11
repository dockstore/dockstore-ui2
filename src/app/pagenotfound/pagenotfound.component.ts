import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  standalone: true,
  imports: [FlexModule, ExtendedModule],
})
export class PageNotFoundComponent {
  Dockstore = Dockstore;
}
