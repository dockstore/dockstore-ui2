/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { DescriptorTypeCompatService } from './descriptor-type-compat.service';
import { ToolDescriptor } from './swagger';

describe('Service: DescriptorTypeCompat', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescriptorTypeCompatService],
    });
  });

  it('should be able to convert ToolDescriptorTypeEnum to Plain TRS descriptor string', inject(
    [DescriptorTypeCompatService],
    (service: DescriptorTypeCompatService) => {
      expect(service).toBeTruthy();
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.CWL)).toEqual('PLAIN-CWL');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.WDL)).toEqual('PLAIN-WDL');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.NFL)).toEqual('PLAIN-NFL');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.SERVICE)).toEqual('PLAIN-SERVICE');

      expect(service.toolDescriptorTypeEnumToPlainTRS(<ToolDescriptor.TypeEnum>'potato')).toEqual(null);
      expect(service.toolDescriptorTypeEnumToPlainTRS(null)).toEqual(null);
    }
  ));
});
