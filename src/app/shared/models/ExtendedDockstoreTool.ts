import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DockstoreTool } from './../openapi/model/dockstoreTool';

export interface ExtendedDockstoreTool extends DockstoreTool {
  agoMessage?: string;
  // Stripped of 'mailto:'
  email?: string;
  // Build date in string format
  lastBuildDate?: string;
  // Update in string format
  lastUpdatedDate?: string;
  versionVerified?: any;
  verifiedSources?: any;
  imgProvider?: string;
  imgProviderUrl?: string;
  providerIcon?: IconProp;
  imgProviderIcon?: IconProp;
  // The transformed git url
  provider?: string;
  providerUrl?: string;
  buildModeTooltip?: string;
}
