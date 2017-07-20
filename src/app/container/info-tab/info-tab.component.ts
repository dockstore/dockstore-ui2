import { ContainerService } from './../../shared/container.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent implements OnInit {
  @Input() validVersions;
  @Input() defaultVersion;
  tool: any;
  constructor(private containerService: ContainerService) {}

  ngOnInit() {
    this.containerService.tool$.subscribe(tool => this.tool = tool);
  }
}
