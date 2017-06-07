export const formErrors = {
    'cwlPath': '',
    'wdlPath': '',
    'dockerfilePath': '',
    'gitPath': '',
    'imagePath': '',
    'label': '',
    'testParameterFilePath': '',
    'toolName': ''
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
    'testParameterFilePath': {
      'required': 'This field cannot be empty.',
      'minlength': 'Test parameter file path is too short. (Min. 3 characters.)',
      'maxlength': 'Test parameter file path is too long. (Max 256 characters.)',
      'pattern': 'Invalid Test parameter file format. ' +
      'Test parameter file path must begin with \'/\' and end with end with \'*.json\', \'*.yml\', or \'*.yaml\'.'
    },
    'toolName': {
      'maxlength': 'Tool Name is too long. (Max 256 characters.)',
      'pattern': 'A Tool Name may only consist of alphanumeric characters and internal underscores or hyphens.'
    },
  };
