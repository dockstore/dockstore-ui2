import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedGalaxy: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'GXFORMAT2',
  value: 'gxformat2',
  shortFriendlyName: 'Galaxy',
  friendlyName: 'Galaxy Workflow Format',
  defaultDescriptorPath: '/Dockstore.yml',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(ga|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /Dockstore.yml',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.GXFORMAT2,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Gxformat2,
  plainTRS: 'PLAIN_GALAXY',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTOREGXFORMAT2],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: false,
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
