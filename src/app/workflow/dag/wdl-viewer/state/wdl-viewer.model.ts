/**
 * Defines types for the response of Pipeline Builder library
 */
export interface WdlViewerPipelineResponse {
  status: boolean;
  message: string;
  model: Array<any>;
  actions: Array<any>;

  // Not originally part of the response object, but all responses should be identified by the workflow version used to generated it
  workflowVersion?: number;
}
