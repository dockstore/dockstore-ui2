import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/openapi';
import { Dockstore } from '../shared/dockstore.model';

const JUPYTER_DOCUMENTATION_URL = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-notebooks.html';

export const extendedJupyter: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'jupyter',
  value: 'jupyter',
  shortFriendlyName: 'Jupyter',
  friendlyName: 'Jupyter notebook',
  defaultDescriptorPath: '/notebook.ipynb',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.ipynb$',
  descriptorPathPlaceholder: 'e.g. /notebook.ipynb',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.JUPYTER,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Jupyter,
  languageDocumentationURL: JUPYTER_DOCUMENTATION_URL,
  plainTRS: 'PLAIN_JUPYTER',
  descriptorFileTypes: [SourceFile.TypeEnum.DOCKSTOREJUPYTER],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Notebook',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.DOCKSTORENOTEBOOKTESTFILE,
  fileTabs: [
    {
      tabName: 'Notebook Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTOREJUPYTER],
    },
    {
      tabName: 'Configuration Files',
      fileTypes: [
        SourceFile.TypeEnum.DOCKSTOREYML,
        SourceFile.TypeEnum.DOCKSTORENOTEBOOKREES,
        SourceFile.TypeEnum.DOCKSTORENOTEBOOKDEVCONTAINER,
      ],
    },
    {
      tabName: 'Test Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORENOTEBOOKTESTFILE],
    },
    {
      tabName: 'Other Files',
      fileTypes: [SourceFile.TypeEnum.DOCKSTORENOTEBOOKOTHER],
    },
  ],
};
