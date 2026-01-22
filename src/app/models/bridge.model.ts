export interface Bridge {
    id?: string;
    name: string;
    slug: string;
    lat: number | null;
    lng: number | null;
    description: string;
    imageUrl?: string;
    publicUrl?: string;
}
