import { Injectable, OnInit } from '@angular/core';

import { ListService } from './list.service';
import { ProviderService } from './provider.service';

@Injectable()
export abstract class ToolLister implements OnInit {

  protected displayTable = false;
  protected publishedTools = [];
  protected _toolType: string;

  constructor(private listService: ListService,
              private providerService: ProviderService,
              private toolType: string) {

    this._toolType = toolType;
  }

  abstract initToolLister(): void;

  ngOnInit() {
    this.listService.getPublishedTools(this._toolType)
      .subscribe(tools => {
        this.publishedTools = tools.map(tool => this.providerService.setUpProvider(tool));
        console.log(this.publishedTools);

        this.initToolLister();

        this.displayTable = true;
      });
  }

}
