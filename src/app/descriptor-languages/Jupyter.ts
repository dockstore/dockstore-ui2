import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';
import { Dockstore } from '../shared/dockstore.model';

const JUPYTER_DOCUMENTATION_URL = Dockstore.DOCUMENTATION_URL + 'TODO';

export const extendedJupyter: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'JUPYTER',
  value: 'jupyter',
  shortFriendlyName: 'Jupyter',
  friendlyName: 'Jupyter notebook',
  defaultDescriptorPath: '/notebook.ipynb',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.ipynb$',
  descriptorPathPlaceholder: 'e.g. /notebook.ipynb',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.JUPYTER,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Jupyter,
  languageDocumentationURL: JUPYTER_DOCUMENTATION_URL,
  plainTRS: null,
  descriptorFileTypes: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Notebook',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.DOCKSTORENOTEBOOKTESTFILE,
  fileTabs: [
    // TODO add notebook entry
    {
      tabName: 'Notebook Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTOREJUPYTER, SourceFile.TypeEnum.DOCKSTORENOTEBOOKOTHER],
    },
    {
      tabName: 'Test Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORENOTEBOOKTESTFILE],
    },
    {
      tabName: 'Configuration Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORENOTEBOOKREES],
    },
  ],
};
