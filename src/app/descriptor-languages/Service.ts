import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';
import { Dockstore } from '../shared/dockstore.model';

const SERVICE_DOCUMENTATION_URL = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-services.html';

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
  languageDocumentationURL: SERVICE_DOCUMENTATION_URL,
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
