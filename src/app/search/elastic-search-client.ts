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
import { Client } from 'elasticsearch-browser';

import { ga4ghExtendedPath } from './../shared/constants';
import { Dockstore } from './../shared/dockstore.model';

export const ELASTIC_SEARCH_CLIENT = new Client({
  host: Dockstore.API_URI + ga4ghExtendedPath,
  apiVersion: '5.6',
  log: 'warning'
});
