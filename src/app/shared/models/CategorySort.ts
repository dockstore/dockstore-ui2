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

export class CategorySort {
  SortBy: boolean; // true: Sort by count; false: Sort by alphabetical
  CountOrderBy: boolean; // true: asc order; false: desc order
  AlphabetOrderBy: boolean; // true: asc order; false: desc order
  constructor(sortBy, countOrderBy, alphabetOrderBy) {
    this.SortBy = sortBy;
    this.CountOrderBy = countOrderBy;
    this.AlphabetOrderBy = alphabetOrderBy;
  }
}
