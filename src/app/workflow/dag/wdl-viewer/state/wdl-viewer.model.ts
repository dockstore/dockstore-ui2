/**
 * Defines types for the response of Pipeline Builder library
 */
export interface WdlViewerPipeline {
  status: boolean;
  message: string;
  model: Array<any>;
  actions: Array<any>;
  id?: number;
}
