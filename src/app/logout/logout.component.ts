import { Component } from '@angular/core';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FlexModule],
})
export class LogoutComponent {}
