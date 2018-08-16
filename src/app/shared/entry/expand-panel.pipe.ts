import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from '../swagger';

@Pipe({
  name: 'expandPanel'
})
export class ExpandPanelPipe implements PipeTransform {
  /**
   * Decides whether the expansion panel is open or not
   *
   * @param {*} orgObj  OrgObj
   * @param {number} entryId  ID of the currently selected workflow
   * @returns {boolean}  true if open, false if not open
   * @memberof ExpandPanelPipe
   */
  transform(orgObj: any, entryId: number): boolean {
    if (orgObj.published.find((entry: Entry) => entry.id === entryId)) {
      return true;
    }
    if (orgObj.unpublished.find((entry: Entry) => entry.id === entryId)) {
      return true;
    }
    return false;
  }
}
