import { I } from '@angular/cdk/keycodes';
import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-sidebar',
  templateUrl: './my-sidebar.component.html',
  styleUrls: ['./my-sidebar.component.scss'],
})
export class MySidebarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let init: boolean = true;
  }
}
