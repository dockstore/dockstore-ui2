import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MyEntriesQuery } from '../state/my-entries.query';
import { MyEntriesStateService } from '../state/my-entries.service';
import { MyEntriesStore } from '../state/my-entries.store';

/**
 * This module contains components and services that are common to all my-entry pages (such as my-tools, my-workflows, my-services)
 *
 * @export
 * @class MyEntriesModule
 */
@NgModule({
  providers: [MyEntriesStateService, MyEntriesStore, MyEntriesQuery],
  imports: [CommonModule],
})
export class MyEntriesModule {}
