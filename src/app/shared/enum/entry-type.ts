/**
 * Note: The strings are directly displayed to the end user ('tool', 'workflow', 'service')
 * which is why BioWorkflow has the 'workflow' string instead
 * Determined by what the user is currently viewing and is set in the session store
 * When user is on the /my-workflows/** page or /workflows page, EntryType is BioWorkflow
 * When user is on the /my-tools/, /my-containers/, /tools/, /containers/ page, EntryType is Tool
 * When user is on the /my-services/, /services/ page, EntryType is Service
 * @export
 * @enum {number}
 */
export enum EntryType {
  Tool = 'tool',
  BioWorkflow = 'workflow',
  Service = 'service',
}
