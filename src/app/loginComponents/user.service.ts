import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class UserService {

  constructor(private localStorageService: LocalStorageService) { }

  getUserObj() {
    return this.localStorageService.get('user');
  }
}
