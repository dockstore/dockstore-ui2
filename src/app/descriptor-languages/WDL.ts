import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { configurationTabName, descriptorFilesTabName, testParameterFilesTabName } from 'app/shared/constants';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';

export const extendedWDL: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'WDL',
  value: 'WDL',
  shortFriendlyName: 'WDL',
  friendlyName: 'Workflow Description Language',
  defaultDescriptorPath: '/Dockstore.wdl',
  descriptorPathPattern: '^\\/([^\\/?:*\\|<>]+\\/)*[^\\/?:*\\|<>]+.wdl$',
  descriptorPathPlaceholder: 'e.g. /Dockstore.wdl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.WDL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.WDL,
  languageDocumentationURL: 'https://openwdl.org/',
  plainTRS: 'PLAIN_WDL',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTOREWDL],
  toolTab: {
    rowIdentifier: 'task\xa0ID',
    workflowStepHeader: 'Task Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.WDLTESTJSON,
  fileTabs: [
    {
      tabName: descriptorFilesTabName,
      fileTypes: [SourceFile.TypeEnum.DOCKSTOREWDL],
    },
    {
      tabName: testParameterFilesTabName,
      fileTypes: [SourceFile.TypeEnum.WDLTESTJSON],
    },
    { tabName: configurationTabName, fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
