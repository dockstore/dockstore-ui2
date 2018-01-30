import { ExpandService } from './../../expand.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expand-collapse',
  templateUrl: './expand-collapse.component.html',
  styleUrls: ['./expand-collapse.component.scss']
})
export class ExpandCollapseComponent implements OnInit {
  expandAll = true;
  constructor(private expandService: ExpandService) { }

  ngOnInit() {
    this.expandService.expandAll$.subscribe(expandAll => this.expandAll = expandAll);
  }

  setExpandAll(expandAll: boolean) {
    this.expandService.setExpandAll(expandAll);
  }
}
