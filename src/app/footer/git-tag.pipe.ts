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
  /**
   * Regex for "2.6.1-26-geb3771b6"
   * @private
   */
  private readonly gitTagRegEx = /-\d+-g(\w{7,})/;
  /**
   * Less than perfect test for commit sha -- hexadecimal for at least 7 chars long
   * @private
   */
  private readonly gitShaRegEx = /[a-f0-9]{7,}/;

  transform(tag: string, withPath?: boolean): string {
    if (!tag) {
      return '';
    }
    const execArray = this.gitTagRegEx.exec(tag);
    if (execArray || this.gitShaRegEx.test(tag)) {
      const actualTag = execArray ? execArray[1] : tag;
      return withPath ? `commits/${actualTag}` : actualTag;
    }
    return withPath ? `releases/tag/${tag}` : tag;
  }
}
