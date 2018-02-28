/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/*
 * The Source Code of this part is from Fuel, "Migrating from Angular 1 to 2: Part 2, Components – Sortable Table"
 * Link: http://www.fueltravel.com/blog/migrating-from-angular-1-to-2-part-2-components-sortable-table/
 * Example use
 *		Basic Array of single type: *ngFor="let todo of todoService.todos | orderBy : '-'"
 *		Multidimensional Array Sort on single column: *ngFor="let todo of todoService.todos | orderBy : ['-status']"
 *		Multidimensional Array Sort on multiple columns: *ngFor="let todo of todoService.todos | orderBy : ['status', '-title']"
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class OrderBy implements PipeTransform {

  value: string [] = [];

  static _orderByComparator(a: any, b: any): number {

    if (a === null || typeof a === 'undefined') {
      a = 0;
    }
    if (b === null || typeof b === 'undefined') {
      b = 0;
    }

    if (typeof(a) === 'boolean' || typeof(b) === 'boolean') {
      if (a && !b) {
        return 1;
      }
      if (!a && b) {
        return -1;
      }
    } else if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      // Isn't a number so lowercase the string to properly compare
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
    } else {
      // Parse strings as numbers to compare properly
      if (parseFloat(a) < parseFloat(b)) {
        return -1;
      }
      if (parseFloat(a) > parseFloat(b)) {
        return 1;
      }
    }

    return 0; // equal each other
  }

  transform(input: any, config: string = '+'): any {

    // make a copy of the input's reference
    if (!input || !input.length) { return; }
    this.value = [...input];
    const value = this.value;

    if (!Array.isArray(value)) {
      return value;
    }

    if (!Array.isArray(config) || (Array.isArray(config) && config.length === 1)) {
      const propertyToCheck: string = !Array.isArray(config) ? config : config[0];
      const desc = propertyToCheck.substr(0, 1) === '-';

      // Basic array
      if (!propertyToCheck || propertyToCheck === '-' || propertyToCheck === '+') {
        return !desc ? value.sort() : value.sort().reverse();
      } else {
        const property: string = propertyToCheck.substr(0, 1) === '+' || propertyToCheck.substr(0, 1) === '-'
          ? propertyToCheck.substr(1)
          : propertyToCheck;

        return value.sort(function (a: any, b: any) {
          return !desc
            ? OrderBy._orderByComparator(a[property], b[property])
            : -OrderBy._orderByComparator(a[property], b[property]);
        });
      }
    } else {
      // Loop over property of the array in order and sort
      return value.sort(function (a: any, b: any) {
        for (let i = 0; i < config.length; i++) {
          const desc = config[i].substr(0, 1) === '-';
          const property = config[i].substr(0, 1) === '+' || config[i].substr(0, 1) === '-'
            ? config[i].substr(1)
            : config[i];

          const comparison = !desc
            ? OrderBy._orderByComparator(a[property], b[property])
            : -OrderBy._orderByComparator(a[property], b[property]);

          // Don't return 0 yet in case of needing to sort by next property
          if (comparison !== 0) {
          }
          return comparison;
        }
        return 0; // equal each other
      });
    }
  }
}
