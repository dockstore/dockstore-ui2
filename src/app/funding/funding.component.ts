import { Component } from '@angular/core';

export interface Funder {
  title: string;
  website: string;
  imageSource: string;
  altImageText: string;
  content: string;
}

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss'],
})
export class FundingComponent {
  GenomeCanadaFunder: Funder = {
    title: 'Genome Canada',
    website: 'https://www.genomecanada.ca/',
    imageSource: '../assets/images/sponsors/genomecanada.png',
    altImageText: 'Genome Canada Logo',
    content: `Genome Canada is a not-for-profit organization, funded by the Government of Canada. We act as a catalyst for developing and
    applying genomics+ and genomic-based technologies to create economic and social benefits for Canadians.`,
  };
  ProvinceOfOntarioFunder: Funder = {
    title: 'Province of Ontario',
    website: 'https://www.ontario.ca',
    imageSource: '../assets/images/sponsors/ontario_new.png',
    altImageText: 'Government of Ontario Logo',
    content: 'This work was funded by the Government of Canada through Genome Canada and the Ontario Genomics Institute (OGI-168).',
  };
  NIHFunder: Funder = {
    title: 'National Institutes of Health',
    website: 'https://www.nih.gov/',
    imageSource: '../assets/images/sponsors/NIH.png',
    altImageText: 'NIH Logo',
    content: 'A part of the U.S. Department of Health and Human Services, NIH is the largest biomedical research agency in the world.',
  };
  BISTIFunder: Funder = {
    title: 'BISTI',
    website: 'https://www.nih.gov/',
    imageSource: '../assets/images/sponsors/bisti-logo.png',
    altImageText: 'BISTI Logo',
    content: `The Biomedical Information Science and Technology Initiative is a consortium of representatives from each of the NIH
    institutes and centers. The mission of BISTI is to make optimal use of computer science and technology to address problems in
    biology and medicine by fostering new basic understandings, collaborations, and transdisciplinary initiatives between the
    computational and biomedical sciences.`,
  };
  BioDataCatalyst: Funder = {
    title: 'BioData Catalyst',
    website: 'http://biodatacatalyst.nhlbi.nih.gov/',
    imageSource: '../assets/images/sponsors/bioDataCatalyst.svg',
    altImageText: 'BioData Catalyst Logo',
    content: `NHLBI BioData Catalyst is a cloud-based platform providing tools, applications, and workflows in secure workspaces. By increasing access to NHLBI datasets and innovative data analysis capabilities, BioData Catalyst accelerates efficient biomedical research that drives discovery and scientific advancement, leading to novel diagnostic tools, therapeutics, and prevention strategies for heart, lung, blood, and sleep disorders.`,
  };
  CFIFunder: Funder = {
    title: 'CFI',
    website: 'https://www.innovation.ca/',
    imageSource: '../assets/images/sponsors/CFI_CMYK.png',
    altImageText: 'CFI Logo',
    content: `The CFI makes financial contributions to Canada’s universities, colleges, research hospitals and non-profit research
    organizations to increase their capability to carry out high quality research.`,
  };
  funders: Funder[] = [
    this.GenomeCanadaFunder,
    this.ProvinceOfOntarioFunder,
    this.NIHFunder,
    this.BISTIFunder,
    this.BioDataCatalyst,
    this.CFIFunder,
  ];
  constructor() {}
}
