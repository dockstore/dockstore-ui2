import { Component, OnInit } from '@angular/core';
import { Base } from 'app/shared/base';

@Component({
  selector: 'app-starred-box',
  templateUrl: './starred-box.component.html',
  styleUrls: ['./starred-box.component.scss'],
})
export class StarredBoxComponent extends Base implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getMyEvents();
  }

  getMyEvents() {}
}
