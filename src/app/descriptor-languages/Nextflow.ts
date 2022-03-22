import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedNFL: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'NEXTFLOW',
  value: 'NFL',
  shortFriendlyName: 'Nextflow',
  friendlyName: 'Nextflow',
  defaultDescriptorPath: '/nextflow.config',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(config)',
  descriptorPathPlaceholder: 'e.g. /nextflow.config',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.NFL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.NFL,
  languageDocumentationURL: 'https://www.nextflow.io/',
  plainTRS: 'PLAIN-NFL',
  descriptorFileTypes: [SourceFile.TypeEnum.NEXTFLOW, SourceFile.TypeEnum.NEXTFLOWCONFIG],
  toolTab: {
    rowIdentifier: 'process\xa0name',
    workflowStepHeader: 'Process Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.NEXTFLOWTESTPARAMS,
  fileTabs: [
    {
      tabName: 'Descriptor Files',
      fileTypes: [SourceFile.TypeEnum.NEXTFLOWCONFIG, SourceFile.TypeEnum.NEXTFLOW],
    },
    {
      tabName: 'Test Parameter Files',
      fileTypes: [SourceFile.TypeEnum.NEXTFLOWTESTPARAMS],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
