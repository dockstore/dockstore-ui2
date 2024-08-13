/*
 *    Copyright 2024 OICR, UCSC
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
import { parseTerms } from './helpers';

describe('helpers', () => {
  it('should parse the search terms correctly', () => {
    expect(parseTerms('')).toEqual([]);
    expect(parseTerms('a')).toEqual(['a']);
    expect(parseTerms('a b')).toEqual(['a', 'b']);
    expect(parseTerms('a b c')).toEqual(['a', 'b', 'c']);
    expect(parseTerms('abc')).toEqual(['abc']);

    expect(parseTerms('""')).toEqual([]);
    expect(parseTerms('"a"')).toEqual(['a']);
    expect(parseTerms('"a b"')).toEqual(['a b']);
    expect(parseTerms('"a b c"')).toEqual(['a b c']);
    expect(parseTerms('"abc"')).toEqual(['abc']);

    expect(parseTerms('a b "c d"')).toEqual(['a', 'b', 'c d']);
    expect(parseTerms('a "b c" d')).toEqual(['a', 'b c', 'd']);
    expect(parseTerms('"a b" c d')).toEqual(['a b', 'c', 'd']);

    expect(parseTerms(' ')).toEqual([]);
    expect(parseTerms('a ')).toEqual(['a']);
    expect(parseTerms(' a')).toEqual(['a']);
    expect(parseTerms(' a ')).toEqual(['a']);

    // should not crash
    parseTerms('"a');
    parseTerms('"a b c');
  });
});
