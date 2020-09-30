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
  transform(bucket: Map<string, number>, subBucket: string): number {
    // Get number of items in the subBucket
    const items = bucket.get(subBucket);

    // Sum up number of items in the bucket to get the divisor
    const bucketValues = Array.from(bucket.values());
    const divisor = bucketValues.reduce((accumulator, currentValue) => accumulator + currentValue);

    // Width of histogram is percetange of items out of total items in the bucket
    const histogramWidth = (Number(items) / divisor) * 100;
    return histogramWidth;
  }
}
