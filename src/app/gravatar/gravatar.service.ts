import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root',
})
export class GravatarService {
  readonly gravatarBaseUrl = 'https://www.gravatar.com/avatar/';

  public gravatarUrlForEmail(email: string, defaultImage: string) {
    const hash = Md5.hashStr(email);
    return `${this.gravatarBaseUrl}${hash}?id=${encodeURIComponent(defaultImage)}&s=500`;
  }

  public gravatarUrlForMysteryPerson() {
    // use "mp" (mystery-person) from https://en.gravatar.com/site/implement/images/
    return `${this.gravatarBaseUrl}000?s=500&d=mp`;
  }

  public gravatarUrlForImageUrl(imageUrl: string | null) {
    return imageUrl ? `${this.gravatarBaseUrl}000?d=${encodeURIComponent(imageUrl)}` : null;
  }
}
