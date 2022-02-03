import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedSMK: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'SMK',
  value: 'SMK',
  shortFriendlyName: 'Snakemake',
  friendlyName: 'Snakemake',
  defaultDescriptorPath: '/Snakefile',
  descriptorPathPattern: '^/([^/?:*|<>]++/)*(Snakefile|[^./?:*|<>]++.smk))$',
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
  testParameterFileType: SourceFile.TypeEnum.SMKTESTPARAMS,
  fileTabs: [
    {
      tabName: 'Descriptor Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESMK],
    },
    {
      tabName: 'Test Parameter Files',
      fileTypes: [SourceFile.TypeEnum.SMKTESTPARAMS],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
