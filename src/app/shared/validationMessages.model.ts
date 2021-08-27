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

interface FormErrors {
  cwlPath: string;
  wdlPath: string;
  dockerfilePath: string;
  gitPath: string;
  imagePath: string;
  repoNameWithSlashesImagePath: string;
  privateAmazonImagePath: string;
  label: string;
  cwlTestParameterFilePath: string;
  wdlTestParameterFilePath: string;
  testParameterFilePath: string;
  toolName: string;
  email: string;
  reference: string;
  versionTag: string;
  workflow_path: string;
  workflowName: string;
  amazonDockerRegistryPath: string;
  sevenBridgesDockerRegistryPath: string;
}

export const formErrors: FormErrors = {
  cwlPath: '',
  wdlPath: '',
  dockerfilePath: '',
  gitPath: '',
  imagePath: '',
  repoNameWithSlashesImagePath: '',
  privateAmazonImagePath: '',
  label: '',
  cwlTestParameterFilePath: '',
  wdlTestParameterFilePath: '',
  testParameterFilePath: '',
  toolName: '',
  email: '',
  reference: '',
  versionTag: '',
  workflow_path: '',
  workflowName: '',
  amazonDockerRegistryPath: '',
  sevenBridgesDockerRegistryPath: '',
};

export const exampleDescriptorPatterns = {
  cwl: 'e.g. /Dockstore.cwl',
  wdl: 'e.g. /Dockstore.wdl',
  nextflow: 'e.g. /nextflow.config',
};

export const validationDescriptorPatterns = {
  gitPath: '^([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)/([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)$',
  cwlPath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(cwl|yaml|yml)',
  wdlPath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.wdl$',
  nflPath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(config)',
  dockerfilePath: '^/([^/?:*|<>]+/)*(([a-zA-Z]+[.])?Dockerfile|Dockerfile([.][a-zA-Z]+)?)$',
  testFilePath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(json|yml|yaml)$',
  imagePath: '^(([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)|_)/([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)$',
  repoNameWithSlashesImagePath: '^(([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)|_)/([a-zA-Z0-9]+([-_./][a-zA-Z0-9]+)*)$',
  privateAmazonImagePath: '^_/([a-zA-Z0-9]+([-_./][a-zA-Z0-9]+)*)$', // Has an empty namespace. Allows for slashes in repo name
  toolName: '^[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*$',
  label: '^(| *([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)( *, *([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))* *)$',
  versionTag: '^[a-zA-Z0-9]+([-_.]*[a-zA-Z0-9]+)*$',
  reference: '[\\w-]+((/|.)[\\w-]+)*',
  workflowDescriptorPath: '^/([^\\/?:*|<>]+/)*[^\\/?:*|<>]+.(cwl|wdl|yaml|yml|config|ga)',
  workflowName: '[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*',
  cwlTestParameterFilePath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(json|yml|yaml)$',
  wdlTestParameterFilePath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(json|yml|yaml)$',
  testParameterFilePath: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(json|yml|yaml)$',
  // This should be used for all validation patterns that are alphanumeric with internal underscores, hyphens, and periods.
  alphanumericInternalUHP: '^[a-zA-Z0-9]+([-_.]*[a-zA-Z0-9]+)*$',
  amazonDockerRegistryPath: '(^[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*.dkr.ecr.[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*.amazonaws.com)|(public.ecr.aws)', // public and private path
  privateAmazonDockerRegistryPath: '^[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*.dkr.ecr.[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*.amazonaws.com',
  sevenBridgesDockerRegistryPath: '^([a-zA-Z0-9]+-)?images.sbgenomics.com',
};

export const validationMessages = {
  cwlPath: {
    required: 'This field cannot be empty.',
    minlength: 'Descriptor Path is too short (minimum 3 characters).',
    maxlength: 'Descriptor Path is too long (max 1000 characters).',
    pattern: `Invalid Descriptor Path format. Descriptor Path must begin with '/' and end with '*.cwl', '*.yml', or '*.yaml'.`,
  },
  wdlPath: {
    required: 'This field cannot be empty.',
    minlength: 'Descriptor Path is too short (minimum 3 characters).',
    maxlength: 'Descriptor Path is too long (max 1000 characters).',
    pattern: `Invalid Descriptor Path format. Descriptor Path must begin with '/' and end with '*.wdl'.`,
  },
  nflPath: {
    required: 'This field cannot be empty.',
    minlength: 'Descriptor Path is too short (minimum 3 characters).',
    maxlength: 'Descriptor Path is too long (max 1000 characters).',
    pattern: `Invalid Descriptor Path format. Descriptor Path must begin with '/' and end with '*.config'.`,
  },
  galaxyPath: {
    required: 'This field cannot be empty.',
    minlength: 'Descriptor Path is too short (minimum 3 characters).',
    maxlength: 'Descriptor Path is too long (max 1000 characters).',
    pattern: `Invalid Descriptor Path format. Descriptor Path must begin with '/' and end with '*.ga', '*.yml', or '*.yaml'.`,
  },
  dockerfilePath: {
    required: 'This field cannot be empty.',
    minlength: 'Dockerfile Path is too short (minimum 3 characters).',
    maxlength: 'Dockerfile Path is too long (max 1000 characters).',
    pattern:
      `Must begin with '/' and end with 'Dockerfile'. ` +
      `Optionally you can use a string as a prefix or a suffix to 'Dockerfile', as long as they are separated by a '.'.`,
  },
  gitPath: {
    required: 'This field cannot be empty.',
    minlength: 'Source Code Repository Path is too short (minimum 3 characters).',
    maxlength: 'Source Code Repository Path is too long (max 128 characters).',
    pattern: `The namespace and name of the Git repository, separated by a '/'. `,
  },
  imagePath: {
    required: 'This field cannot be empty.',
    minlength: 'Image Path is too short (minimum 3 characters).',
    maxlength: 'Image Path is too long (max 128 characters).',
    pattern: `The namespace and name of the image repository, separated by a '/'. The name of the image repository cannot contain additional '/'.`,
  },
  repoNameWithSlashesImagePath: {
    required: 'This field cannot be empty.',
    minlength: 'Image Path is too short (minimum 3 characters). ',
    maxlength: 'Image Path is too long (max 128 characters).',
    pattern: `The namespace and name of the image repository, separated by a '/'. The name of the image repository may contain additional '/'.`,
  },
  privateAmazonImagePath: {
    required: 'This field cannot be empty.',
    minlength: 'Image Path is too short (minimum 3 characters).',
    maxlength: 'Image Path is too long (max 128 characters).',
    pattern: `The namespace and name of the image repository, separated by a '/'. The namespace must be empty (use '_'). The name of the image repository may contain additional '/'.`,
  },
  label: {
    maxlength: 'Labels string is too long (max 512 characters).',
    pattern: 'Labels are comma-delimited, and may only consist of alphanumerical characters and internal hyphens.',
  },
  cwlTestParameterFilePath: {
    required: 'This field cannot be empty.',
    minlength: 'Test parameter file path is too short (minimum 3 characters).',
    maxlength: 'Test parameter file path is too long (max 1000 characters).',
    pattern: `Must begin with '/' and end with '*.json', '*.yml', or '*.yaml'.`,
  },
  wdlTestParameterFilePath: {
    required: 'This field cannot be empty.',
    minlength: 'Test parameter file path is too short (minimum 3 characters).',
    maxlength: 'Test parameter file path is too long (max 1000 characters).',
    pattern: `Must begin with '/' and end with '*.json', '*.yml', or '*.yaml'.`,
  },
  testParameterFilePath: {
    required: 'This field cannot be empty.',
    minlength: 'Test parameter file path is too short (minimum 3 characters).',
    maxlength: 'Test parameter file path is too long (max 1000 characters).',
    pattern: `Must begin with '/' and end with '*.json', '*.yml', or '*.yaml'.`,
  },
  toolName: {
    maxlength: 'Tool Name is too long (max 256 characters).',
    pattern: 'A Tool Name may only consist of alphanumeric characters, internal underscores, and internal hyphens.',
  },
  email: {
    required: 'This field cannot be empty.',
    maxlength: 'Email is too long (max 256 characters).',
  },
  reference: {
    required: 'This field cannot be empty.',
    minlength: 'Git reference is too short (minimum 3 characters).',
    maxlength: 'Git reference is too long (max 128 characters).',
    pattern: `May only consist of alphanumeric characters, '-' and '_', with interior '/' and '.' separators.`,
  },
  versionTag: {
    required: 'This field cannot be empty.',
    maxlength: 'Version Tag is too long (max 128 characters).',
    pattern: 'A Version Tag may only consist of alphanumeric characters, internal underscores, internal hyphens, and internal periods.',
  },
  workflow_path: {
    required: 'This field cannot be empty.',
    minlength: 'Workflow Path is too short (minimum 3 characters).',
    maxlength: 'Workflow Path is too long (max 1000 characters).',
    pattern: `Must begin with '/' and end with '*.cwl', '*.yml', '*.yaml', '*.config', or'*.wdl' ` + 'depending on the descriptor type.',
  },
  repository: {
    maxlength: 'Repository Name is too long (max 256 characters).',
    pattern: 'A Repository may only consist of alphanumeric characters, internal underscores, and internal hyphens.',
  },
  workflowName: {
    maxlength: 'Workflow Name is too long (max 256 characters).',
    pattern: 'A Workflow Name may only consist of alphanumeric characters, internal underscores, and internal hyphens.',
  },
  amazonDockerRegistryPath: {
    required: 'This field cannot be empty.',
    maxlength: 'Custom docker registry path is too long (max 256 characters).',
    pattern:
      'Must be of the form *.dkr.ecr.*.amazonaws.com or public.ecr.aws, where * can be any alphanumeric character,' +
      ' internal underscores, and internal hyphens.',
  },
  sevenBridgesDockerRegistryPath: {
    required: 'This field cannot be empty.',
    maxlength: 'Custom docker registry path is too long (max 256 characters).',
    pattern: 'Must be of the form *-images.sbgenomics.com or images.sbgenomics.com, where * can be any alphanumeric character.',
  },
};
