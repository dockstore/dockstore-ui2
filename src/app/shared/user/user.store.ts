import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ExtendedUserData, User } from '../swagger';

export interface UserState {
  user: User;
  extendedUserData: ExtendedUserData;
}

export function createInitialState(): UserState {
  return {
    user: null,
    extendedUserData: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserStore extends Store<UserState> {
  constructor() {
    super(createInitialState());
  }
}
