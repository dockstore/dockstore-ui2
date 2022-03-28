import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedWDL: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'WDL',
  value: 'WDL',
  shortFriendlyName: 'WDL',
  friendlyName: 'Workflow Description Language',
  defaultDescriptorPath: '/Dockstore.wdl',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.wdl$',
  descriptorPathPlaceholder: 'e.g. /Dockstore.wdl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.WDL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.WDL,
  plainTRS: 'PLAIN-WDL',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTOREWDL],
  toolTab: {
    rowIdentifier: 'task\xa0ID',
    workflowStepHeader: 'Task Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.WDLTESTJSON,
  fileTabs: [
    {
      tabName: 'Descriptor Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTOREWDL],
    },
    {
      tabName: 'Test Parameter Files',
      fileTypes: [SourceFile.TypeEnum.WDLTESTJSON],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
