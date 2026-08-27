import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HeaderComponent, FlexModule],
})
export class LogoutComponent {}
