import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';

export const extendedGalaxy: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'gxformat2',
  value: 'gxformat2',
  shortFriendlyName: 'Galaxy',
  friendlyName: 'Galaxy Workflow Format',
  defaultDescriptorPath: '/workflow-name.yml',
  descriptorPathPattern: '^\\/([^\\/?:*\\|<>]+\\/)*[^\\/?:*\\|<>]+.(ga|yaml|yml)$',
  descriptorPathPlaceholder: 'e.g. /workflow-name.yml',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.GALAXY,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Gxformat2,
  languageDocumentationURL: 'https://galaxyproject.org/',
  plainTRS: 'PLAIN_GALAXY',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTOREGXFORMAT2],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.GXFORMAT2TESTFILE,
  fileTabs: [
    {
      tabName: 'Descriptor Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTOREGXFORMAT2],
    },
    {
      tabName: 'Test Parameter Files',
      fileTypes: [SourceFile.TypeEnum.GXFORMAT2TESTFILE],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTOREYML] },
  ],
};
