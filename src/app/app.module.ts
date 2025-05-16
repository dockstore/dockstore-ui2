/**
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
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { ConfigurationService } from './configuration.service';
import { EntryTypeMetadataService } from './entry/type-metadata/entry-type-metadata.service';
import { Configuration } from './shared/openapi/configuration';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 500,
  touchendHideDelay: 500,
};

export const myCustomSnackbarDefaults: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
};

export function initializerFactory(
  configurationService: ConfigurationService,
  entryTypeMetadataService: EntryTypeMetadataService
): Function {
  return () => Promise.all([configurationService.load(), entryTypeMetadataService.load()]);
}

export const apiConfig = new Configuration({
  apiKeys: {},
  basePath: window.location.protocol + '//' + window.location.host + '/api',
});

export function getApiConfig() {
  return apiConfig;
}
