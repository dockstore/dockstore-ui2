import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Notification } from '../../shared/swagger/model/notification';

export interface NotificationsState extends EntityState<Notification> {
  notifications: Array<Notification>;
}

export function createInitialState() {
  return {
    notifications: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'notifications' })
export class NotificationsStore extends EntityStore<NotificationsState> {
  constructor() {
    super(createInitialState());
  }
}
