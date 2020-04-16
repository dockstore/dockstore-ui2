import { DescriptorLanguageBean, SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

/**
 * TODO: Use the value property to map the DescriptorLanguageBean to this
 */
export interface ExtendedDescriptorLanguageBean extends DescriptorLanguageBean {
  shortFriendlyName: string;
  defaultDescriptorPath: string;
  descriptorPathPattern: string;
  descriptorPathPlaceholder: string;
  toolDescriptorEnum: ToolDescriptor.TypeEnum;
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum;
  plainTRS: string;
  sourceFileTypeEnum: SourceFile.TypeEnum[];
  toolTab: {
    // Example: If rowIdentifier is "tool ID", then the the first column of each row will say something like "tool ID: hello-world"
    rowIdentifier: string;
    // This is the header that goes in the second column of the tool tab table (Example: Tool Excerpt)
    workflowStepHeader: string;
  };
  workflowLaunchSupport: boolean;
}

const extendedCWL: ExtendedDescriptorLanguageBean = {
  value: 'CWL',
  shortFriendlyName: 'CWL',
  friendlyName: 'Common Workflow Language',
  defaultDescriptorPath: '/Dockstore.cwl',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(cwl|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /Dockstore.cwl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.CWL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.CWL,
  plainTRS: 'PLAIN-CWL',
  sourceFileTypeEnum: [SourceFile.TypeEnum.DOCKSTORECWL],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt'
  },
  workflowLaunchSupport: true
};

const extendedWDL: ExtendedDescriptorLanguageBean = {
  value: 'WDL',
  shortFriendlyName: 'WDL',
  friendlyName: 'Workflow Description Language',
  defaultDescriptorPath: '/Dockstore.wdl',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.wdl$',
  descriptorPathPlaceholder: 'e.g. /Dockstore.wdl',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.WDL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.WDL,
  plainTRS: 'PLAIN-WDL',
  sourceFileTypeEnum: [SourceFile.TypeEnum.DOCKSTOREWDL],
  toolTab: {
    rowIdentifier: 'task\xa0ID',
    workflowStepHeader: 'Task Excerpt'
  },
  workflowLaunchSupport: true
};

const extendedNFL: ExtendedDescriptorLanguageBean = {
  value: 'NFL',
  shortFriendlyName: 'Nextflow',
  friendlyName: 'Nextflow',
  defaultDescriptorPath: '/nextflow.config',
  descriptorPathPattern: '^^/([^/?:*|<>]+/)*[^/?:*|<>]+.(config)',
  descriptorPathPlaceholder: 'e.g. /nextflow.config',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.NFL,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.NFL,
  plainTRS: 'PLAIN-NFL',
  sourceFileTypeEnum: [SourceFile.TypeEnum.NEXTFLOW, SourceFile.TypeEnum.NEXTFLOWCONFIG],
  toolTab: {
    rowIdentifier: 'process\xa0name',
    workflowStepHeader: 'Process Excerpt'
  },
  workflowLaunchSupport: true
};

const extendedService: ExtendedDescriptorLanguageBean = {
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
  sourceFileTypeEnum: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Service'
  },
  workflowLaunchSupport: true
};

const extendedGalaxy: ExtendedDescriptorLanguageBean = {
  value: 'gxformat2',
  shortFriendlyName: 'Galaxy',
  friendlyName: 'Galaxy Workflow Format',
  defaultDescriptorPath: '/Dockstore.yml',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(ga|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /Dockstore.yml',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.GXFORMAT2,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.Gxformat2,
  plainTRS: '<FILL-IN>',
  sourceFileTypeEnum: [SourceFile.TypeEnum.DOCKSTOREGXFORMAT2],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt'
  },
  workflowLaunchSupport: false
};

export const extendedUnknownDescriptor: ExtendedDescriptorLanguageBean = {
  value: null,
  shortFriendlyName: null,
  friendlyName: null,
  defaultDescriptorPath: null,
  descriptorPathPattern: '.*',
  descriptorPathPlaceholder: '',
  toolDescriptorEnum: null,
  workflowDescriptorEnum: null,
  plainTRS: null,
  sourceFileTypeEnum: [],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt'
  },
  workflowLaunchSupport: false
};
export const extendedDescriptorLanguages: ExtendedDescriptorLanguageBean[] = [
  extendedCWL,
  extendedWDL,
  extendedNFL,
  extendedService,
  extendedGalaxy
];
