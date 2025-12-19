export interface LatLng {
    lat: number;
    lng: number;
}

/** Distance in meters (Haversine) */
export function distance(a: LatLng, b: LatLng): number {
    const R = 6371000;
    const φ1 = toRad(a.lat);
    const φ2 = toRad(b.lat);
    const Δφ = toRad(b.lat - a.lat);
    const Δλ = toRad(b.lng - a.lng);

    const x =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Bearing from A → B (0–360°) */
export function bearing(a: LatLng, b: LatLng): number {
    const φ1 = toRad(a.lat);
    const φ2 = toRad(b.lat);
    const λ1 = toRad(a.lng);
    const λ2 = toRad(b.lng);

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function toRad(deg: number) {
    return deg * Math.PI / 180;
}

function toDeg(rad: number) {
    return rad * 180 / Math.PI;
}
