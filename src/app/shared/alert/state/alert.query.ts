import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AlertStore, AlertState } from './alert.store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertQuery extends Query<AlertState> {
  showInfo$: Observable<boolean> = this.select(state => state.type === 'info' && !!state.message);
  showError$: Observable<boolean> = this.select(state => state.type === 'error' && !!state.message);
  message$: Observable<string> = this.select(state => state.message);
  details$: Observable<string> = this.select(state => state.details);
  constructor(protected store: AlertStore) {
    super(store);
  }
}
