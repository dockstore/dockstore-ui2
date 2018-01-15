import { DockstoreTool } from './../swagger/model/dockstoreTool';
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
    // The transformed git url
    provider?: string;
    providerUrl?: string;
    buildMode?: string;
    buildModeTooltip?: string;
}
