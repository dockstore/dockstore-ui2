import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Workflow } from './../openapi/model/workflow';

export interface ExtendedWorkflow extends Workflow {
  agoMessage?: string;
  // Stripped of 'mailto:'
  email?: string;
  versionVerified?: any;
  verifiedSources?: any;
  // The transformed git url
  provider?: string;
  providerUrl?: string;
  providerIcon?: IconProp;
}
