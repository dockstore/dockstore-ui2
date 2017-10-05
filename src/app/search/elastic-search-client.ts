import { Dockstore } from './../shared/dockstore.model';
import { Client } from 'elasticsearch';

export const ELASTIC_SEARCH_CLIENT = new Client({
    host: Dockstore.API_URI + '/api/ga4gh/v1/extended',
    apiVersion: '5.x',
    log: 'debug'
  });
