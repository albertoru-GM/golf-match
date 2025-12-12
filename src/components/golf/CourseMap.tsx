'use client';

import dynamic from 'next/dynamic';
import { Course } from '@/types';
import { Loader2 } from 'lucide-react';

const MapInner = dynamic(() => import('./CourseMapInner'), {
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
    ),
    ssr: false
});

interface CourseMapProps {
    courses: Course[];
    userLocation?: { lat: number; lng: number } | null;
}

export default function CourseMap({ courses, userLocation }: CourseMapProps) {
    // Default center (Spain) if no user location
    const center: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [40.4168, -3.7038];

    // Zoom in closer (12) if we have user location, otherwise generic country view (6)
    // User requested ~30-50km radius. Zoom 10 shows roughly a city + surroundings.
    const zoom = userLocation ? 10 : 6;

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 relative z-0">
            <MapInner courses={courses} center={center} zoom={zoom} />
        </div>
    );
}
