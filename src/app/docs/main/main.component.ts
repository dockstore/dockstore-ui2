import { Component, OnInit } from '@angular/core';

import { Doc } from '../doc.model';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
  docs: Doc[];

  constructor(private docsService: DocsService) { }

  ngOnInit() {
    this.docs = this.docsService.getDocs();
  }

}
