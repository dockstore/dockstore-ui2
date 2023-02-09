import { Component, Injectable } from '@angular/core';

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
@Injectable()
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
  // Due to not having permission to use BD Catalyst's logo, the source here is a text generated placeholder
  BioDataCatalyst: Funder = {
    title: 'NHLBI BioData Catalyst®',
    website: 'https://biodatacatalyst.nhlbi.nih.gov/',
    // imageSource: '../assets/images/sponsors/bioDataCatalyst.svg',
    imageSource: '../assets/images/sponsors/BDCatalyst-text-generated.png',
    altImageText: 'NHLBI BioData Catalyst® Logo',
    content: `NHLBI BioData Catalyst® (BDC) is a cloud-based platform providing tools, applications, and workflows in secure workspaces. By increasing access to NHLBI datasets and innovative data analysis capabilities, BDC accelerates efficient biomedical research that drives discovery and scientific advancement, leading to novel diagnostic tools, therapeutics, and prevention strategies for heart, lung, blood, and sleep disorders.`,
  };
  CFIFunder: Funder = {
    title: 'CFI',
    website: 'https://www.innovation.ca/',
    imageSource: '../assets/images/sponsors/CFI_CMYK.png',
    altImageText: 'CFI Logo',
    content: `The authors wish to acknowledge the funding support of the Canada Foundation for Innovation Cyberinfrastructure Initiative, the Ontario Research Fund, BC Knowledge Development Fund and the Ministère de l'Économie, de la Science et l'Innovation for 'The Cancer Genome Collaboratory' project.`,
  };
  AmazonFunder: Funder = {
    title: 'Amazon',
    website: 'https://aws.amazon.com/genomics-cli/',
    imageSource: '../assets/images/sponsors/aws.png',
    altImageText: 'AWS Logo',
    content: `Amazon has partnered with Dockstore to allow Amazon Genomics CLI users quick and easy access to the workflows registered with Dockstore.`,
  };
  NHGRIFunder: Funder = {
    title: 'NHGRI',
    website: 'https://www.genome.gov/',
    imageSource: '../assets/images/sponsors/NHGRI.png',
    altImageText: 'NHGRI Logo',
    content: `NHGRI is part of the National Institute of Health (NIH). As a leading authority in the field of genomics, NHGRI's mission is to accelerate scientific and medical breakthroughs that improve human health. We do this by driving cutting-edge research, developing new technologies, and studying the impact of genomics on society.`,
  };

  funders: Funder[] = [
    this.GenomeCanadaFunder,
    this.ProvinceOfOntarioFunder,
    this.NIHFunder,
    this.BISTIFunder,
    this.BioDataCatalyst,
    this.CFIFunder,
    this.AmazonFunder,
    this.NHGRIFunder,
  ];

  currentFunders: Funder[] = [this.AmazonFunder, this.GenomeCanadaFunder, this.NHGRIFunder, this.NIHFunder, this.ProvinceOfOntarioFunder];

  previousFunders: Funder[] = [this.BISTIFunder, this.CFIFunder, this.BioDataCatalyst];

  getFunders(): Funder[] {
    return this.funders;
  }
  constructor() {}
}
