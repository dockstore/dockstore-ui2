/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */

import { User } from './openapi/model/user';
import { TokenSource } from './enum/token-source.enum';

export const ga4ghPath = '/ga4gh/trs/v2';
export const ga4ghExtendedPath = '/api/ga4gh/v2/extended';
export const formInputDebounceTime = 250;
export const ga4ghNotebookIdPrefix = '#notebook/';
export const ga4ghWorkflowIdPrefix = '#workflow/';
export const ga4ghServiceIdPrefix = '#service/';
export const includesValidation = 'validations';
export const includesVersions = 'versions';
export const includesAuthors = 'authors';
export const bootstrap4smallModalSize = '300px';
export const bootstrap4mediumModalSize = '500px';
export const bootstrap4largeModalSize = '800px';
export const bootstrap4extraLargeModalSize = '1140px';
export const myBioWorkflowsURLSegment = 'my-workflows';
export const myServicesURLSegment = 'my-services';
export const myToolsURLSegment = 'my-tools';
export const myNotebooksURLSegment = 'my-notebooks';
export const bioWorkflowsURLSegment = 'workflows';
export const servicesURLSegment = 'services';
export const toolsURLSegment = 'tools';
export const notebooksURLSegment = 'notebooks';
export const altAvatarImg = 'http://www.imcslc.ca/imc/includes/themes/imc/images/layout/img_placeholder_avatar.jpg';
export const devMode = false;
export const currentTOSVersion: User.TosversionEnum = User.TosversionEnum.TOSVERSION2;
export const currentPrivacyPolicyVersion: User.PrivacyPolicyVersionEnum = User.PrivacyPolicyVersionEnum.PRIVACYPOLICYVERSION25;
export const dismissedLatestTOS = 'dismissedLatestTOS';
export const dismissedLatestPrivacyPolicy = 'dismissedLatestPrivacyPolicy';
// There is a search term length limit of 256 on the backend, but two extra characters, '.*', get counted in the backend.
export const searchTermLengthLimit = 254;
// List of common terms to exclude from tag cloud
export const tagCloudCommonTerms: string[] = [
  'tool',
  'workflow',
  'dockstore',
  'master',
  'build_status',
  'server',
  'different',
  'given',
  'the',
  'a',
  'an',
  'between',
  'this',
  'that',
  'these',
  'those',
  'I',
  'you',
  'he',
  'she',
  'it',
  'we',
  'us',
  'him',
  'her',
  'they',
  'them',
  'mine',
  'their',
  'to',
  'from',
  'of',
  'and',
  'in',
  'is',
  'on',
];
export const accountInfo = [
  {
    name: 'GitHub',
    source: TokenSource.GITHUB,
    bold: 'One of GitHub or Google is required.',
    control: true,
    docker: false,
    research: false,
    message: 'GitHub credentials are used for login purposes as well as for pulling source code from GitHub.',
    show: false,
    logo: 'github.svg',
  },
  {
    name: 'Google',
    source: TokenSource.GOOGLE,
    bold: 'One of GitHub or Google is required.',
    control: false,
    docker: false,
    research: false,
    message: 'Google credentials are used for login purposes and integration with Terra.',
    show: false,
    logo: 'google.svg',
  },
  {
    name: 'Quay',
    source: TokenSource.QUAY,
    bold: '',
    control: false,
    docker: true,
    research: false,
    message: 'Quay.io credentials are used for pulling information about Docker images and automated builds.',
    show: false,
    logo: 'quay.svg',
  },
  {
    name: 'Bitbucket',
    source: TokenSource.BITBUCKET,
    bold: '',
    control: true,
    docker: false,
    research: false,
    message: 'Bitbucket credentials are used for pulling source code from Bitbucket.',
    show: false,
    logo: 'bitbucket.svg',
  },
  {
    name: 'GitLab',
    source: TokenSource.GITLAB,
    bold: '',
    control: true,
    docker: false,
    research: false,
    message: 'GitLab credentials are used for pulling source code from GitLab.',
    show: false,
    logo: 'gitlab.svg',
  },
  {
    name: 'Zenodo',
    source: TokenSource.ZENODO,
    bold: '',
    control: false,
    docker: false,
    research: true,
    message: 'Zenodo credentials are used for creating Digital Object Identifiers (DOIs) on Zenodo.',
    show: false,
    logo: 'zenodo.jpg',
  },
  {
    name: 'ORCID',
    source: TokenSource.ORCID,
    bold: '',
    control: false,
    docker: false,
    research: true,
    message:
      'ORCID credentials are used for creating ORCID works by exporting snapshotted entries and versions from Dockstore and to link to your ORCID record when your Dockstore account is displayed on the site.',
    show: false,
    logo: 'orcid.svg',
  },
];
