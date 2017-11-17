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

export const formErrors = {
  'cwlPath': '',
  'wdlPath': '',
  'dockerfilePath': '',
  'gitPath': '',
  'imagePath': '',
  'label': '',
  'cwlTestParameterFilePath': '',
  'wdlTestParameterFilePath': '',
  'testParameterFilePath': '',
  'toolName': '',
  'email': '',
  'reference': '',
  'versionTag': '',
  'workflow_path': '',
  'workflowName': ''
};

export const validationPatterns = {
  'gitPath': '^([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)/([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)$',
  'cwlPath': '^/([^\/?:*|<>]+/)*[^\/?:*|<>]+\.(cwl|yaml|yml)',
  'wdlPath': '^/([^\/?:*|<>]+/)*[^\/?:*|<>]+.wdl$',
  'dockerfilePath': '^/([^\/?:*|<>]+/)*(([a-zA-Z]+[.])?Dockerfile|Dockerfile([.][a-zA-Z]+)?)$',
  'testFilePath': '^/([^\/?:*|<>]+/)*[^\/?:*|<>]+.(json|yml|yaml)$',
  'imagePath': '^(([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)|_)/([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)$',
  'toolName': '^[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*$',
  'label': '^(| *([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)( *, *([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))* *)$',
  'versionTag': '^[a-zA-Z0-9]+([-_\.]*[a-zA-Z0-9]+)*$',
  'reference': '[\\w-]+((/|.)[\\w-]+)*',
  'workflowDescriptorPath': '^\/([^\\\/\?\:\*\|\<\>]+\/)*[^\\\/\?\:\*\|\<\>]+\.(cwl|wdl|yaml|yml)',
  'workflowName': '[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*',
  'cwlTestParameterFilePath': '^/([^\/?:*|<>]+/)*[^\/?:*|<>]+.(json|yml|yaml)$',
  'wdlTestParameterFilePath': '^/([^\/?:*|<>]+/)*[^\/?:*|<>]+.(json|yml|yaml)$',
  'testParameterFilePath': '^/([^\/?:*|<>]+/)*[^\/?:*|<>]+.(json|yml|yaml)$'
};

export const validationMessages = {
  'cwlPath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Descriptor Path is too short. (Min. 3 characters.)',
    'maxlength': 'Descriptor Path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Descriptor Path format. Descriptor Path must begin with \'/\' and end with \'*.cwl\', \'*.yml\', or\'*.yaml\'.'
  },
  'wdlPath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Descriptor Path is too short. (Min. 3 characters.)',
    'maxlength': 'Descriptor Path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Descriptor Path format. Descriptor Path must begin with \'/\' and end with \'*.wdl\'.'
  },
  'dockerfilePath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Dockerfile Path is too short. (Min. 3 characters.)',
    'maxlength': 'Dockerfile Path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Dockerfile Path format. Dockerfile Path must begin with \'/\' and end with \'/Dockerfile\'.'
  },
  'gitPath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Source Code Repository Path is too short. (Min. 3 characters.)',
    'maxlength': 'Source Code Repository Path is too long. (Max 128 characters.)',
    'pattern': 'The namespace and name of the Git repository, separated by a \'/\'. ' +
    'Currently, only GitHub, Bitbucket and GitLab are supported third-party platforms.'
  },
  'imagePath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Image Path is too short. (Min. 3 characters.)',
    'maxlength': 'Image Path is too long. (Max 128 characters.)',
    'pattern': 'The namespace and name of the image repository, separated by a \'/\'. ' +
    'Use \'_\' for an empty namespace. Currently, only Quay.io and Docker Hub are supported third-party platforms.'
  },
  'label': {
    'maxlength': 'Labels string is too long. (Max 512 characters.)',
    'pattern': 'Labels are comma-delimited, and may only contain alphanumerical characters and internal hyphens.'
  },
  'cwlTestParameterFilePath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Test parameter file path is too short. (Min. 3 characters.)',
    'maxlength': 'Test parameter file path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Test parameter file format. ' +
    'Test parameter file path must begin with \'/\' and end with \'*.json\', \'*.yml\', or \'*.yaml\'.'
  },
  'wdlTestParameterFilePath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Test parameter file path is too short. (Min. 3 characters.)',
    'maxlength': 'Test parameter file path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Test parameter file format. ' +
    'Test parameter file path must begin with \'/\' and end with \'*.json\', \'*.yml\', or \'*.yaml\'.'
  },
  'testParameterFilePath': {
    'required': 'This field cannot be empty.',
    'minlength': 'Test parameter file path is too short. (Min. 3 characters.)',
    'maxlength': 'Test parameter file path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Test parameter file format. ' +
    'Test parameter file path must begin with \'/\' and end with \'*.json\', \'*.yml\', or \'*.yaml\'.'
  },
  'toolName': {
    'maxlength': 'Tool Name is too long. (Max 256 characters.)',
    'pattern': 'A Tool Name may only consist of alphanumeric characters and internal underscores or hyphens.'
  },
  'email': {
    'maxlength': 'Email is too long. (Max 256 characters.)'
  },
  'reference': {
    'required': 'This field cannot be empty.',
    'minlength': 'Git reference is too short. (Min. 3 characters.)',
    'maxlength': 'Git reference is too long. (Max 128 characters.)',
    'pattern': 'Invalid Git Reference format. ' +
    'An Git Reference path may only consist of alphanumeric characters, \'-\' and \'_\', with interior \'/\' and \'.\' separators.'
  },
  'versionTag': {
    'required': 'This field cannot be empty.',
    'maxlength': 'Tag Name is too long. (Max 128 characters.)',
    'pattern': 'A Tag Name may only consist of alphanumeric characters and internal hyphens, periods and underscores.'
  },
  'workflow_path': {
    'required': 'This field cannot be empty.',
    'minlength': 'Workflow Path is too short. (Min. 3 characters.)',
    'maxlength': 'Workflow Path is too long. (Max 256 characters.)',
    'pattern': 'Invalid Workflow Path format. ' +
    'Workflow Path must begin with \'/\' and end with \'*.cwl\', \'*.yml\', \'*.yaml\', or\'*.wdl\'.'
  },
  'workflowName': {
    'maxlength': 'Workflow Name is too long. (Max 256 characters.)',
    'pattern': 'A Workflow Name may only consist of alphanumeric characters and internal underscores or hyphens.'
  }
};
