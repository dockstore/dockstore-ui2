import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CwlViewerService } from './cwl-viewer.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Dockstore } from '../../../shared/dockstore.model';

describe('Service: CWLViewer', () => {

  let cwlViewerService: CwlViewerService;
  let httpMock: HttpTestingController;
  let commonWlEndpoint: string;
  const providerUrl = 'https://github.com/dockstore-testing/Metaphlan-ISBCGC';
  const reference = 'master';
  const workflowPath = '/metaphlan_wfl.cwl';

  const cwlViewerResponse
    = {
    'retrievedFrom': {
      'repoUrl': 'https://github.com/dockstore-testing/Metaphlan-ISBCGC.git',
      'branch': 'master',
      'path': 'metaphlan_wfl.cwl',
      'packedId': null,
      'url': 'https://github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl',
      'rawUrl': 'https://raw.githubusercontent.com/dockstore-testing/Metaphlan-ISBCGC/master/metaphlan_wfl.cwl',
      'type': 'GITHUB'
    },
    'retrievedOn': 1518199020779,
    'lastCommit': '9283b35ae651477f5e722111b07c8128aa66c0ea',
    'label': 'metaphlan_wfl.cwl',
    'permalink': 'https://w3id.org/cwl/view/git/9283b35ae651477f5e722111b07c8128aa66c0ea/metaphlan_wfl.cwl',
    'visualisationXdot': '/graph/xdot/github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl',
    'visualisationPng': '/graph/png/github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl',
    'visualisationSvg': '/graph/svg/github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl',
    'roBundle': '/robundle/github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl'
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ CwlViewerService ]
    });
    cwlViewerService = TestBed.get(CwlViewerService);
    commonWlEndpoint = cwlViewerService.cwlViewerEndpoint(providerUrl, reference, workflowPath);
    httpMock = TestBed.get(HttpTestingController);
  });

  it ('should work if POST returns 200', (done) => {
    cwlViewerService.getVisualizationUrls(providerUrl, reference, workflowPath).subscribe(
      (resp) => {
        expect(resp.svgUrl).toBe(Dockstore.CWL_VISUALIZER_URI +
          '/graph/svg/github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl');
        expect(resp.webPageUrl).toBe(commonWlEndpoint);
        done();
      },
      () => {
      });
    const response200 = httpMock.expectOne(commonWlEndpoint);
    response200.flush(cwlViewerResponse);
    httpMock.verify();
  });

  it ('should work if POST returns 202', fakeAsync(() => {
    cwlViewerService.getVisualizationUrls(providerUrl, reference, workflowPath).subscribe(
      (resp) => {
        expect(resp.svgUrl).toBe(Dockstore.CWL_VISUALIZER_URI +
          '/graph/svg/github.com/dockstore-testing/Metaphlan-ISBCGC/blob/master/metaphlan_wfl.cwl');
      },
      () => {
      });
    const response202 = httpMock.expectOne(commonWlEndpoint);
    response202.flush(null, {
      headers: {
        Location: '/queue/1'
      },
      status: 202, statusText: 'Accepted'});
    tick(400);
    const poll = httpMock.expectOne(Dockstore.CWL_VISUALIZER_URI + '/queue/1');
    poll.flush(cwlViewerResponse);
    httpMock.verify();
  }));

  it ('should fail if POST returns 400', (done) => {
    cwlViewerService.getVisualizationUrls(providerUrl, reference, workflowPath).subscribe(null,
      () => done());
    const response400 = httpMock.expectOne(commonWlEndpoint);
    response400.flush(null, {status: 400, statusText: 'Bad Request'});
    httpMock.verify();
  });
});
