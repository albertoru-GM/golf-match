import { Course } from '@/types';

interface OSMNode {
    type: 'node' | 'way' | 'relation';
    id: number;
    lat: number;
    lon: number;
    center?: { lat: number; lon: number };
    tags?: {
        name?: string;
        website?: string;
        'addr:city'?: string;
        'addr:street'?: string;
    };
}

interface OverpassResponse {
    elements: OSMNode[];
}

export async function searchGolfCoursesInBounds(
    south: number,
    west: number,
    north: number,
    east: number
): Promise<Course[]> {
    // Query for golf courses (leisure=golf_course)
    // We ask for 'center' to get a single point for polygons (ways/relations)
    const query = `
        [out:json][timeout:25];
        (
          node["leisure"="golf_course"](${south},${west},${north},${east});
          way["leisure"="golf_course"](${south},${west},${north},${east});
          relation["leisure"="golf_course"](${south},${west},${north},${east});
        );
        out center;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch from Overpass API');
        }

        const data: OverpassResponse = await response.json();

        return data.elements.map((el) => {
            const lat = el.lat || el.center?.lat || 0;
            const lng = el.lon || el.center?.lon || 0;
            const name = el.tags?.name || 'Campo de Golf (Sin nombre)';
            const location = el.tags?.['addr:city']
                ? `${el.tags['addr:city']}, España`
                : 'España';

            return {
                id: `osm-${el.id}`, // Unique ID for OSM items
                name: name,
                location: location,
                // Use a reliable local placeholder
                image_url: '/courses/course-1.jpg',
                rating: 4.0, // Default rating
                holes: 18, // Assumption
                par: 72, // Assumption
                amenities: ['Campo de Golf'],
                lat: lat,
                lng: lng,
                // Try to find a website, otherwise search link logic could go here
                booking_url: el.tags?.website || `https://www.google.com/search?q=${encodeURIComponent(name + ' golf booking')}`,
                address: el.tags?.['addr:street'] || location
            };
        }).filter(c => c.lat !== 0 && c.lng !== 0); // basic validation

    } catch (error) {
        console.error('Error fetching OSM data:', error);
        return [];
    }
}
