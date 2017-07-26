import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { ListService } from './list.service';
import { ProviderService } from './provider.service';

@Injectable()
export abstract class ToolLister implements OnInit {

  protected displayTable = false;
  protected publishedTools = [];
  protected _toolType: string;
  dtTrigger: Subject<any> = new Subject();

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
        this.initToolLister();
        this.displayTable = true;
        console.log('uuu');
      });
  }

}
