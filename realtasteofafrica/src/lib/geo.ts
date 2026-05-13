/** Earth mean radius in kilometers (WGS84). */
const R_KM = 6371

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Haversine distance between two WGS84 points in kilometers.
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R_KM * c
}

export function kmToMiles(km: number): number {
  return km * 0.621_371
}

export function formatDistanceMiles(km: number): string {
  const mi = kmToMiles(km)
  if (mi < 10) return `${mi.toFixed(1)} mi`
  return `${Math.round(mi)} mi`
}
