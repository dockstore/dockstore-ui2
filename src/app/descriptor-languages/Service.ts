import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedService: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'SERVICE',
  value: 'service',
  shortFriendlyName: 'Service',
  friendlyName: 'generic placeholder for services',
  defaultDescriptorPath: '/.dockstore.yml',
  // This is not really applicable
  descriptorPathPattern: '.*',
  descriptorPathPlaceholder: 'e.g. /.dockstore.yml',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.SERVICE,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Service,
  plainTRS: 'PLAIN-SERVICE',
  descriptorFileTypes: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Service',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON,
  fileTabs: [
    {
      tabName: 'Descriptor Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICEOTHER],
    },
    {
      tabName: 'Test Parameter Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICEYML] },
  ],
};
