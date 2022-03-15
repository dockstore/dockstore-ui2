import { Pipe, PipeTransform } from '@angular/core';
import { GravatarService } from './gravatar.service';

/*
 * Wraps a url with a gravatar url
 */
@Pipe({
  name: 'gravatar',
})
export class GravatarPipe implements PipeTransform {
  constructor(private gravatarService: GravatarService) {}
  transform(url: string | null): string | null {
    return this.gravatarService.gravatarUrlForImageUrl(url);
  }
}
