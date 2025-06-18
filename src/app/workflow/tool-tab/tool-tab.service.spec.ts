import { inject, TestBed } from '@angular/core/testing';
import { ToolDescriptor } from '../../shared/openapi';
import { ToolTabService } from './tool-tab.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Service: ToolTab', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ToolTabService, DescriptorLanguageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
  });

  it('should ...', inject([ToolTabService], (service: ToolTabService) => {
    expect(service).toBeTruthy();
  }));

  it('should determines the correct workflow excerpt row heading', inject([ToolTabService], (service: ToolTabService) => {
    expect(service.descriptorTypeToWorkflowExcerptRowHeading(ToolDescriptor.TypeEnum.CWL)).toEqual('tool\xa0ID');
    expect(service.descriptorTypeToWorkflowExcerptRowHeading(ToolDescriptor.TypeEnum.WDL)).toEqual('task\xa0ID');
    expect(service.descriptorTypeToWorkflowExcerptRowHeading(ToolDescriptor.TypeEnum.NFL)).toEqual('process\xa0name');
    expect(service.descriptorTypeToWorkflowExcerptRowHeading(<ToolDescriptor.TypeEnum>'Potato')).toEqual('tool\xa0ID');
  }));

  it('should determines the correct workflow excerpt row heading', inject([ToolTabService], (service: ToolTabService) => {
    expect(service.descriptorTypeToHeaderName(ToolDescriptor.TypeEnum.CWL)).toEqual('Tool Excerpt');
    expect(service.descriptorTypeToHeaderName(ToolDescriptor.TypeEnum.WDL)).toEqual('Task Excerpt');
    expect(service.descriptorTypeToHeaderName(ToolDescriptor.TypeEnum.NFL)).toEqual('Process Excerpt');
    expect(service.descriptorTypeToHeaderName(<ToolDescriptor.TypeEnum>'Potato')).toEqual('Tool Excerpt');
  }));
});
