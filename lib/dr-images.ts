// DR Image URL Utilities

export function getDRImageUrl(
  entityId: string,
  width = 480,
  height = 270,
  format: 'jpg' | 'webp' = 'jpg'
): string {
  return `https://prod95-static.dr-massive.com/api/shain/v1/dataservice/ResizeImage/$value?Format='${format}'&Quality=85&EntityType='Item'&EntityId='${entityId}'&Width=${width}&Height=${height}&ResizeAction='fill'`;
}

export function getDRSeriesUrl(slug: string, entityId: string): string {
  return `https://www.dr.dk/drtv/serie/${slug}_${entityId}`;
}
