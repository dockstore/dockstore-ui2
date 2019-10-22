import { Workflow } from './../swagger/model/workflow';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
