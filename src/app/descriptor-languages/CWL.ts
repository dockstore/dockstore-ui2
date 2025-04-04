import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { configurationTabName, descriptorFilesTabName, testParameterFilesTabName } from 'app/shared/constants';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';

export const extendedCWL: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'CWL',
  value: 'CWL',
  shortFriendlyName: 'CWL',
  friendlyName: 'Common Workflow Language',
  defaultDescriptorPath: '/Dockstore.cwl',
  descriptorPathPattern: '^\\/([^\\/?:*\\|<>]+\\/)*[^\\/?:*\\|<>]+.(cwl|yaml|yml)$',
  descriptorPathPlaceholder: 'e.g. /Dockstore.cwl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.CWL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.CWL,
  languageDocumentationURL: 'https://www.commonwl.org/',
  plainTRS: 'PLAIN_CWL',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTORECWL],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.CWLTESTJSON,
  fileTabs: [
    {
      tabName: descriptorFilesTabName,
      fileTypes: [SourceFile.TypeEnum.DOCKSTORECWL],
    },
    {
      tabName: testParameterFilesTabName,
      fileTypes: [SourceFile.TypeEnum.CWLTESTJSON],
    },
    { tabName: configurationTabName, fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
