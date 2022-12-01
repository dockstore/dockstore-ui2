/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { inject, TestBed } from '@angular/core/testing';
import { DescriptorTypeCompatService } from './descriptor-type-compat.service';
import { ToolVersion } from './openapi';
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
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.CWL)).toEqual('PLAIN_CWL');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.WDL)).toEqual('PLAIN_WDL');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.NFL)).toEqual('PLAIN_NFL');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.GXFORMAT2)).toEqual('PLAIN_GALAXY');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.SMK)).toEqual('PLAIN_SMK');
      expect(service.toolDescriptorTypeEnumToPlainTRS(ToolDescriptor.TypeEnum.SERVICE)).toEqual(null);

      expect(service.toolDescriptorTypeEnumToPlainTRS(<ToolDescriptor.TypeEnum>'potato')).toEqual(null);
      expect(service.toolDescriptorTypeEnumToPlainTRS(null)).toEqual(null);
    }
  ));

  it('should be able to convert ToolDescriptor.TypeEnum to ToolVersion.DescriptorTypeEnum', inject(
    [DescriptorTypeCompatService],
    (service: DescriptorTypeCompatService) => {
      expect(service).toBeTruthy();
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(ToolDescriptor.TypeEnum.CWL)).toEqual(
        ToolVersion.DescriptorTypeEnum.CWL
      );
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(ToolDescriptor.TypeEnum.WDL)).toEqual(
        ToolVersion.DescriptorTypeEnum.WDL
      );
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(ToolDescriptor.TypeEnum.NFL)).toEqual(
        ToolVersion.DescriptorTypeEnum.NFL
      );
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(ToolDescriptor.TypeEnum.GXFORMAT2)).toEqual(
        ToolVersion.DescriptorTypeEnum.GALAXY
      );
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(ToolDescriptor.TypeEnum.SMK)).toEqual(
        ToolVersion.DescriptorTypeEnum.SMK
      );
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(ToolDescriptor.TypeEnum.SERVICE)).toEqual(
        ToolVersion.DescriptorTypeEnum.SERVICE
      );

      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(<ToolDescriptor.TypeEnum>'potato')).toEqual(null);
      expect(service.toolDescriptorTypeEnumToToolVersionDescriptorTypeEnum(null)).toEqual(null);
    }
  ));
});
