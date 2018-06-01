import { Injectable } from '@angular/core';

@Injectable()
export class PathService {

  constructor() { }

  /**
   * This function is taken from the native node path module https://github.com/jinder/path/blob/master/path.js#L270
   * Style changes and types added as well as popping the base path in order to get the base directory instead
   * @param {string} from The absolute base path (which is a file path)
   * @param {string} to The absolute path that will be converted to relative path
   * @returns {string} A relative path based on the DIRECTORY of the 'from' parameter (not the 'from' file path)
   * @memberof PathService
   */
  public relative(from: string, to: string): string {
    const toParts = this.trimArray(to.split('/'));
    const lowerFromParts = this.trimArray(from.split('/'));

    // Calculating relative to the directory of the 'from' file, not from the actual file
    lowerFromParts.pop();
    const lowerToParts = this.trimArray(to.split('/'));

    const length = Math.min(lowerFromParts.length, lowerToParts.length);
    let samePartsLength = length;
    for (let i = 0; i < length; i++) {
      if (lowerFromParts[i] !== lowerToParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    if (samePartsLength === 0) {
      // Don't return absolute path, change to relative even if the base is root
      return toParts.join('/');
    }

    let outputParts = [];
    for (let i = samePartsLength; i < lowerFromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join('/');
  }

  /**
   * returns an array with empty elements removed from either end of the input
   * array or the original array if no elements need to be removed
   * https://github.com/jinder/path/blob/master/path.js#L58
   * @private
   * @param {Array<string>} arr Path segments
   * @returns {Array<string>} Path segments without empty elements
   * @memberof PathService
   */
  private trimArray(arr: Array<string>): Array<string> {
    const lastIndex = arr.length - 1;
    let start = 0;
    for (; start <= lastIndex; start++) {
      if (arr[start]) {
        break;
      }
    }

    let end = lastIndex;
    for (; end >= 0; end--) {
      if (arr[end]) {
        break;
      }
    }

    if (start === 0 && end === lastIndex) {
      return arr;
    }
    if (start > end) {
      return [];
    }
    return arr.slice(start, end + 1);
  }

}
