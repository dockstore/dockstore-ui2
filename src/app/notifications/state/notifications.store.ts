import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { PublicNotification } from 'app/shared/openapi';

export interface NotificationsState extends EntityState<PublicNotification> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'notifications' })
export class NotificationsStore extends EntityStore<NotificationsState> {
  constructor() {
    super();
  }
}
