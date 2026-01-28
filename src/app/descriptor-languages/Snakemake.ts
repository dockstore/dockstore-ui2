import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { configurationTabName, descriptorFilesTabName, testParameterFilesTabName } from 'app/shared/constants';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';

export const extendedSMK: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'SMK',
  value: 'SMK',
  shortFriendlyName: 'Snakemake',
  friendlyName: 'Snakemake',
  defaultDescriptorPath: '/Snakefile',
  descriptorPathPattern: '^\\/([^\\/?:*\\|<>]+\\/)*(Snakefile|[^.\\/?:*\\|<>]+.smk)$',
  descriptorPathPlaceholder: 'e.g. /Snakefile',

  toolDescriptorEnum: ToolDescriptor.TypeEnum.SMK,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.SMK,
  languageDocumentationURL: 'https://snakemake.github.io/',

  plainTRS: 'PLAIN_SMK',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTORESMK],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.SMKTESTPARAMS,
  fileTabs: [
    {
      tabName: descriptorFilesTabName,
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESMK],
    },
    {
      tabName: testParameterFilesTabName,
      fileTypes: [SourceFile.TypeEnum.SMKTESTPARAMS],
    },
    { tabName: configurationTabName, fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
    {
      tabName: 'Other Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTOREWORKFLOWOTHER],
    },
  ],
};
