import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ExtendedUserData, User } from '../swagger';
import { UserState, UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserQuery extends Query<UserState> {
  user$: Observable<User> = this.select(state => state.user);
  extendedUserData$: Observable<ExtendedUserData> = this.select(state => state.extendedUserData);
  userId$: Observable<number> = this.select(state => state.user ? state.user.id : null);
  canChangeUsername$: Observable<boolean> = this.select(state => state.extendedUserData ? state.extendedUserData.canChangeUsername : false);
  username$: Observable<string> = this.select(state => state.user ? state.user.username : null);
  constructor(protected store: UserStore) {
    super(store);
  }
}
