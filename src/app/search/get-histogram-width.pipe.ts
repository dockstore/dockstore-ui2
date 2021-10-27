import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getHistogramWidth',
})
export class GetHistogramWidthPipe implements PipeTransform {
  /**
   * This pipe sums number of items in a facet and returns the width of the histogram as a proportion
   *
   * @param {Map<string, number>} bucket The items in one facet
   * @param {string} subBucket The sub-bucket value (e.g. http://edamontology.org/data_9090)
   * @returns {number} The width of the histogram for that row
   * @memberof GetHistogramWidthPipe
   */
  transform(buckets: { Items: Map<string, number>; SelectedItems: Map<string, number> }, subBucket: string): number {
    const bucket = new Map([...buckets.Items, ...buckets.SelectedItems]);
    // Get number of items in the subBucket
    const items = bucket.get(subBucket);

    // Sum up number of items in the bucket to get the divisor
    const bucketValues = Array.from(bucket.values());
    const divisor = bucketValues.reduce((accumulator, currentValue) => accumulator + currentValue);

    // Width of histogram is percetange of items out of total items in the bucket
    const histogramWidth = (Number(items) / divisor) * 100;

    // Arbitrary scaling so that selected boolean facets (like Verified) won't have the histogram take up the entire width
    // Downside is that the histogram doesn't appear to "add" up to 100% when looking at a single facet
    return histogramWidth * 0.75;
  }
}
