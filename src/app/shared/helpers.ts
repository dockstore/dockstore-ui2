/**
 * True if site should be in extended mode, false otherwise
 */
export function toExtendSite(url: string): boolean {
  return url.startsWith('/my-workflows') || url.startsWith('/my-tools') || url.startsWith('/my-services');
}
