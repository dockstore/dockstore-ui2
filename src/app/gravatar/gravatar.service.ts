import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root',
})
export class GravatarService {
  readonly gravatarBaseUrl = 'https://www.gravatar.com/avatar/';
  constructor() {}

  public gravatarUrlForEmail(email: string, defaultImage: string) {
    const hash = Md5.hashStr(email);
    return `${this.gravatarBaseUrl}${hash}}?id=${defaultImage}&s=500`;
  }

  public gravatarUrlForMysteryPerson() {
    // https://en.gravatar.com/site/implement/images/ -- it's "mp", not "mm" there, but we've had it like this
    return `${this.gravatarBaseUrl}?d=mm&s=500`;
  }

  public gravatarUrlForImageUrl(imageUrl: string | null) {
    return imageUrl ? `${this.gravatarBaseUrl}000?d=${imageUrl}` : null;
  }
}
