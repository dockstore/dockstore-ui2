import { NgModule } from '@angular/core';
import { SessionQuery } from '../shared/session/session.query';
import { SessionStore } from '../shared/session/session.store';
import { SessionService } from '../shared/session/session.service';

export const sessionProviders = [
  SessionStore,
  SessionQuery,
  SessionService
];

@NgModule({
  providers: [sessionProviders]
})
export class CoreModule { }
