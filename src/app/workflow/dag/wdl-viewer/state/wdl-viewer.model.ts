/**
 * Defines types for the response of Pipeline Builder library
 */
export interface WdlViewerPipelineResponse {
  status: boolean;
  message: string;
  model: Array<any>;
  actions: Array<any>;
}
