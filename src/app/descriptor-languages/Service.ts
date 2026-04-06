import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';
import { Dockstore } from '../shared/dockstore.model';
import { configurationTabName, descriptorFilesTabName, testParameterFilesTabName } from 'app/shared/constants';

const SERVICE_DOCUMENTATION_URL = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-services.html';

export const extendedService: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'service',
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
  plainTRS: null,
  descriptorFileTypes: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Service',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON,
  fileTabs: [
    {
      tabName: descriptorFilesTabName,
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICEOTHER],
    },
    {
      tabName: testParameterFilesTabName,
      fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICETESTJSON],
    },
    { tabName: configurationTabName, fileTypes: [SourceFile.TypeEnum.DOCKSTORESERVICEYML] },
  ],
};
