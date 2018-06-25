/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ListService } from './list.service';
import { ProviderService } from './provider.service';

export abstract class ToolLister implements OnInit {

  protected previewMode = false;
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
    this.listService.getPublishedTools(this._toolType, this.previewMode)
      .subscribe(tools => {
        this.publishedTools = tools.map(tool => this.providerService.setUpProvider(tool));
        this.initToolLister();
        this.displayTable = true;
      });
  }

}
