import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExtendedUserData, User } from '../openapi';
import { UserState, UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserQuery extends Query<UserState> {
  user$: Observable<User> = this.select((state) => state.user);
  noUser$ = this.user$.pipe(map((user) => !user));
  isCurator$: Observable<boolean> = this.select((state) => (state.user ? state.user.curator : null));
  isAdmin$: Observable<boolean> = this.select((state) => (state.user ? state.user.isAdmin : null));
  isPlatformPartner$: Observable<boolean> = this.select((state) => (state.user ? (state.user.platformPartner ? true : false) : null));
  isAdminOrCurator$: Observable<boolean> = this.select((state) => (state.user ? state.user.curator || state.user.isAdmin : null));
  extendedUserData$: Observable<ExtendedUserData> = this.select((state) => state.extendedUserData);
  userId$: Observable<number> = this.select((state) => (state.user ? state.user.id : null));
  canChangeUsername$: Observable<boolean> = this.select((state) =>
    state.extendedUserData ? state.extendedUserData.canChangeUsername : false
  );
  isUsernameChangeRequired$: Observable<boolean> = this.select((state) => (state.user ? state.user.usernameChangeRequired : null));
  username$: Observable<string> = this.select((state) => (state.user ? state.user.username : null));
  constructor(protected store: UserStore) {
    super(store);
  }
}
