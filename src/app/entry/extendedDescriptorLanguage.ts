import { DescriptorLanguageBean, SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

/**
 * Use the value property to map the DescriptorLanguageBean to this
 */
export interface ExtendedDescriptorLanguage extends DescriptorLanguageBean {
  descriptorPathPattern: string;
  descriptorPathPlaceholder: string;
  toolDescriptorEnum: ToolDescriptor.TypeEnum;
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum;
  plainTRS: string;
  sourceFileTypeEnum: SourceFile.TypeEnum[];
  toolTab: {
    // Example: If rowIdentifier is "tool ID", then the the first column of each row will say something like "tool ID: hello-world"
    rowIdentifier: string;
    secondColumnHeading: string;
  };
}

const superCWL: ExtendedDescriptorLanguage = {
  value: 'CWL',
  friendlyName: 'Workflow Descriptor ',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(cwl|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /Dockstore.cwl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.CWL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.CWL,
  plainTRS: 'PLAIN-CWL',
  sourceFileTypeEnum: [SourceFile.TypeEnum.DOCKSTORECWL],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    secondColumnHeading: 'Tool Excerpt'
  }
};

const superWDL: ExtendedDescriptorLanguage = {
  value: 'WDL',
  friendlyName: 'Workflow Description Language',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.wdl$',
  descriptorPathPlaceholder: 'e.g. /Dockstore.wdl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.WDL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.WDL,
  plainTRS: 'PLAIN-WDL',
  sourceFileTypeEnum: [SourceFile.TypeEnum.DOCKSTOREWDL],
  toolTab: {
    rowIdentifier: 'task\xa0ID',
    secondColumnHeading: 'Task Excerpt'
  }
};

const superNFL: ExtendedDescriptorLanguage = {
  value: 'NFL',
  friendlyName: 'Nextflow',
  descriptorPathPattern: '^^/([^/?:*|<>]+/)*[^/?:*|<>]+.(config)',
  descriptorPathPlaceholder: 'e.g. /nextflow.config',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.NFL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.NFL,
  plainTRS: 'PLAIN-NFL',
  sourceFileTypeEnum: [SourceFile.TypeEnum.NEXTFLOW, SourceFile.TypeEnum.NEXTFLOWCONFIG],
  toolTab: {
    rowIdentifier: 'process\xa0name',
    secondColumnHeading: 'Process Excerpt'
  }
};

const superService: ExtendedDescriptorLanguage = {
  value: 'service',
  friendlyName: 'generic placeholder for services',
  // This is not really applicable
  descriptorPathPattern: '.*',
  descriptorPathPlaceholder: 'e.g. /.dockstore.yml',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.SERVICE,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Service,
  plainTRS: 'PLAIN-SERVICE',
  sourceFileTypeEnum: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    secondColumnHeading: 'Service'
  }
};

const superGalaxy: ExtendedDescriptorLanguage = {
  value: 'gxformat2',
  friendlyName: 'Galaxy Workflow Format 2',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(ga|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /Dockstore.yml',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.GXFORMAT2,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Gxformat2,
  plainTRS: '<FILL-IN>',
  sourceFileTypeEnum: [SourceFile.TypeEnum.DOCKSTOREGXFORMAT2],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    secondColumnHeading: 'Tool Excerpt'
  }
};

export const extendedUnknownDescriptor: ExtendedDescriptorLanguage = {
  value: null,
  friendlyName: null,
  descriptorPathPattern: '.*',
  descriptorPathPlaceholder: '',
  toolDescriptorEnum: null,
  workflowDescriptorEnum: null,
  plainTRS: null,
  sourceFileTypeEnum: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    secondColumnHeading: 'Tool Excerpt'
  }
};
export const extendedDescriptorLanguages: ExtendedDescriptorLanguage[] = [superCWL, superWDL, superNFL, superService, superGalaxy];
