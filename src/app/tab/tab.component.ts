import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {
  @Input('tabTitle') title: string;
  @Input('imgSrc') img: string;
  @Input() active = false;
}
