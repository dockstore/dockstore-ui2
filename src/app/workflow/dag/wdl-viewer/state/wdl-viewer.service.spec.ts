/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import * as pipeline from 'pipeline-builder';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { WdlViewerPipelineResponse } from './wdl-viewer.model';
import { WdlViewerService } from './wdl-viewer.service';
describe('StarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WdlViewerService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([WdlViewerService], (service: WdlViewerService) => {
    expect(service).toBeTruthy();
  }));
  it('should be able generate the model', inject([WdlViewerService], (service: WdlViewerService) => {
    const content = `
    import "https://raw.githubusercontent.com/DataBiosphere/topmed-workflows/1.32.0/aligner/u_of_michigan_aligner/u_of_michigan_aligner.wdl" as TopMed_aligner
import "https://raw.githubusercontent.com/DataBiosphere/topmed-workflows/1.32.0/aligner/u_of_michigan_aligner-checker/u_of_michigan_aligner_checker_calculation.wdl" as checker

workflow checkerWorkflow {
  String docker_image

  File input_crai_file
  File input_cram_file

  File inputTruthCRAMFile

  File ref_alt
  File ref_bwt
  File ref_sa
  File ref_amb
  File ref_ann
  File ref_pac

  File ref_fasta
  File ref_fasta_index

  File dbSNP_vcf
  File dbSNP_vcf_index

 call TopMed_aligner.TopMedAligner as aligner {
   input:

     input_crai_file = input_crai_file,
     input_cram_file = input_cram_file,

     docker_image = docker_image,

     ref_fasta = ref_fasta,
     ref_fasta_index = ref_fasta_index,
     ref_alt = ref_alt,
     ref_bwt = ref_bwt,
     ref_sa = ref_sa,
     ref_amb = ref_amb,
     ref_ann = ref_ann,
     ref_pac = ref_pac,

     dbSNP_vcf = dbSNP_vcf,
     dbSNP_vcf_index = dbSNP_vcf_index

 }


 call checker.checkerTask {
    input:
        inputCRAMFile = aligner.aligner_output_cram,
        inputTruthCRAMFile = inputTruthCRAMFile,
        referenceFile = ref_fasta,
        docker_image = docker_image }
}`;
    const observable = <Observable<WdlViewerPipelineResponse>>from(pipeline.parse(content));
    observable.pipe(first()).subscribe(response => {
      expect(response).not.toEqual(null);
    });
  }));
});
