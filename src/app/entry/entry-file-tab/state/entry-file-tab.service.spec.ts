import { ToolFile, WorkflowVersion } from 'app/shared/swagger';
import { EntryFileTabService } from './entry-file-tab.service';

describe('Service: EntryFileTabService', () => {
  it('should be able to get the validation message object from a ToolFile', () => {
    const toolFile: ToolFile = {
      file_type: ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR
    };
    const unsupportedToolFile: ToolFile = {
      file_type: ToolFile.FileTypeEnum.CONTAINERFILE
    };
    const version: WorkflowVersion = {
      name: 'do not care',
      reference: 'do not care',
      validations: [
        { id: 51918, message: `{"fakeFilePath":"fakeErrorMessage"}`, type: 'DOCKSTORE_GXFORMAT2', valid: true },
        { id: 51919, message: '{}', type: 'GXFORMAT2_TEST_FILE', valid: true }
      ]
    };
    expect(EntryFileTabService.getValidationMessageObject(null, null)).toEqual(null);
    expect(EntryFileTabService.getValidationMessageObject(toolFile, null)).toEqual(null);
    expect(EntryFileTabService.getValidationMessageObject(null, version)).toEqual(null);
    expect(EntryFileTabService.getValidationMessageObject(toolFile, version)).toEqual(JSON.parse(`{"fakeFilePath":"fakeErrorMessage"}`));
    expect(EntryFileTabService.getValidationMessageObject(unsupportedToolFile, version)).toEqual(null);
    version.validations[0].message = 'notJson';
    expect(EntryFileTabService.getValidationMessageObject(toolFile, version)).toEqual(null);
    version.validations = null;
    expect(EntryFileTabService.getValidationMessageObject(toolFile, version)).toEqual(null);
  });
});
