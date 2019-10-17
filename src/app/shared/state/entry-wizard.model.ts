import { ID } from '@datorama/akita';

export interface EntryWizard {
  id: ID;
}

/**
 * A factory function that creates EntryWizard
 */
export function createEntryWizard(params: Partial<EntryWizard>) {
  return {} as EntryWizard;
}
