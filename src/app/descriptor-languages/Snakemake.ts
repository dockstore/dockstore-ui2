import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedSMK: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'SMK',
  value: 'SMK',
  shortFriendlyName: 'SMK',
  friendlyName: 'Snakemake',
  defaultDescriptorPath: '/Snakefile',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^./?:*|<>]+(.smk)?$',
  descriptorPathPlaceholder: 'e.g. /Snakefile',

  toolDescriptorEnum: ToolDescriptor.TypeEnum.SMK,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.SMK,

  plainTRS: 'PLAIN-SMK',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTORESMK],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.DOCKSTORESMK,
  fileTabs: [
    {
      tabName: 'Descriptor Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESMK],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
