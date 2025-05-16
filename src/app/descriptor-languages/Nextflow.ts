import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { configurationTabName, descriptorFilesTabName, testParameterFilesTabName } from 'app/shared/constants';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';

export const extendedNFL: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'NFL',
  value: 'NFL',
  shortFriendlyName: 'Nextflow',
  friendlyName: 'Nextflow',
  defaultDescriptorPath: '/nextflow.config',
  descriptorPathPattern: '^\\/([^\\/?:*\\|<>]+\\/)*[^\\/?:*\\|<>]+.(config)$',
  descriptorPathPlaceholder: 'e.g. /nextflow.config',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.NFL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.NFL,
  languageDocumentationURL: 'https://www.nextflow.io/',
  plainTRS: 'PLAIN_NFL',
  descriptorFileTypes: [SourceFile.TypeEnum.NEXTFLOW, SourceFile.TypeEnum.NEXTFLOWCONFIG],
  toolTab: {
    rowIdentifier: 'process\xa0name',
    workflowStepHeader: 'Process Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.NEXTFLOWTESTPARAMS,
  fileTabs: [
    {
      tabName: descriptorFilesTabName,
      fileTypes: [SourceFile.TypeEnum.NEXTFLOWCONFIG, SourceFile.TypeEnum.NEXTFLOW],
    },
    {
      tabName: testParameterFilesTabName,
      fileTypes: [SourceFile.TypeEnum.NEXTFLOWTESTPARAMS],
    },
    { tabName: configurationTabName, fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
