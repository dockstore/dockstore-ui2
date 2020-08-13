import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms the value returned by `git describe --tag` into a GitHub path.
 * If you run `git describe --tag` when the GIT HEAD is a tag, then it returns the
 * tag name, e.g., 2.6.1.
 * If you run `git describe --tag` when the GIT HEAD is not a tag, then it returns
 * the most recent tag name in the branch, the number of commits since the tag, and the
 * commit id, preceded by `g`, e.g., 2.6.1-26-geb3771b6.
 */
@Pipe({
  name: 'gitTag'
})
export class GitTagPipe implements PipeTransform {
  readonly versionRegEx = /-\d+-g(\w{8})/;

  transform(tag: string): string {
    const execArray = this.versionRegEx.exec(tag);
    if (execArray) {
      return `/commits/${execArray[1]}`;
    }
    return `/releases/tags/${tag}`;
  }
}
