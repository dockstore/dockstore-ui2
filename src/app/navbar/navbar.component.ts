import { Component } from '@angular/core';

import { Logout } from '../loginComponents/logout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends Logout { }
