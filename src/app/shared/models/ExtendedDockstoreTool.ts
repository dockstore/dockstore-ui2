import { DockstoreTool } from './../openapi/model/dockstoreTool';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

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
  providerIcon?: IconDefinition;
  imgProviderIcon?: IconDefinition;
  // The transformed git url
  provider?: string;
  providerUrl?: string;
  buildModeTooltip?: string;
}
