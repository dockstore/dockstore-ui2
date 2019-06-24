import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface AlertState {
  message: string;
  details: string;
  type: 'error' | 'info';
}

export function createInitialState(): AlertState {
  return {
    message: '',
    details: '',
    type: 'info'
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'alert' })
export class AlertStore extends Store<AlertState> {
  constructor() {
    super(createInitialState());
  }
}
