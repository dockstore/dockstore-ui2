import { Injectable } from '@angular/core';
import bodybuilder from 'bodybuilder';

/**
 * This service constructs all the querys and should be only class that interacts with the bodybuilder library.
 *
 * @export
 * @class QueryBuilderService
 */
@Injectable()
export class QueryBuilderService {

    constructor() { }

    getTagCloudQuery(type: string): string {
        let body = bodybuilder().size();
        body = body.query('match', '_type', type);
        body = body.aggregation('significant_terms', 'description', 'tagcloud', { size: 20 }).build();
        const toolQuery = JSON.stringify(body, null, 1);
        return toolQuery;
    }
}
