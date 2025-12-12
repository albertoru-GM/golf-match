'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Course } from '@/types';
import L from 'leaflet';
import { ArrowRight, Search, Navigation } from 'lucide-react';
import { searchGolfCoursesInBounds } from '@/lib/osm';

// Custom small marker icon (Golf Flag - Red)
const customIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `
    <div style="position: relative; width: 30px; height: 30px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [4, 30],
    popupAnchor: [10, -30]
});

interface CourseMapInnerProps {
    courses: Course[];
    center: [number, number];
    zoom: number;
}

// Internal component to handle search logic and button rendering
function MapInteractionOverlay({
    initialCourses,
    setCourses
}: {
    initialCourses: Course[],
    setCourses: (c: Course[]) => void
}) {
    const map = useMap();
    const [searching, setSearching] = useState(false);

    const handleSearchArea = async () => {
        setSearching(true);
        try {
            const bounds = map.getBounds();
            const south = bounds.getSouth();
            const west = bounds.getWest();
            const north = bounds.getNorth();
            const east = bounds.getEast();

            const newCourses = await searchGolfCoursesInBounds(south, west, north, east);

            // Merge with existing real courses
            const combinedCourses = [...initialCourses];
            newCourses.forEach(osmCourse => {
                const isDuplicate = combinedCourses.some(
                    dbCourse => dbCourse.name === osmCourse.name &&
                        Math.abs((dbCourse.lat || 0) - (osmCourse.lat || 0)) < 0.001
                );
                if (!isDuplicate) {
                    combinedCourses.push(osmCourse);
                }
            });
            setCourses(combinedCourses);
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', marginTop: '10px', marginRight: '10px' }}>
            <div className="leaflet-control">
                <button
                    onClick={handleSearchArea}
                    disabled={searching}
                    className="bg-white text-gray-800 text-xs font-bold py-2 px-4 rounded-full shadow-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    {searching ? (
                        <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Search className="w-3 h-3 text-gray-600" />
                    )}
                    {searching ? 'Buscando...' : 'Buscar zona'}
                </button>
            </div>
        </div>
    );
}

// Component to handle map centering
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function CourseMapInner({ courses: initialCourses, center, zoom }: CourseMapInnerProps) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);

    // Sync if props change
    useEffect(() => {
        setCourses(initialCourses);
    }, [initialCourses]);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={center} zoom={zoom} />

            <MapInteractionOverlay initialCourses={courses} setCourses={setCourses} />

            {courses.map((course) => (
                course.lat && course.lng && (
                    <Marker key={course.id} position={[course.lat, course.lng]} icon={customIcon}>
                        <Popup>
                            <div className="p-1 min-w-[200px]">
                                <h3 className="font-bold text-gray-900 mb-1">{course.name}</h3>
                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <Navigation className="w-3 h-3 mr-1" />
                                    {course.location}
                                </div>

                                <div className="space-y-2">
                                    {/* Detail Link - Always Show */}
                                    {!course.id.startsWith('osm-') && (
                                        <a
                                            href={`/courses/${course.id}`}
                                            className="w-full bg-gray-100 text-gray-800 text-xs font-bold py-2 px-3 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        >
                                            Ver Detalles
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </a>
                                    )}

                                    {/* Booking Link - Always Show */}
                                    <button
                                        onClick={() => window.open(course.booking_url || `https://www.google.com/search?q=${encodeURIComponent(course.name + ' golf booking')}`, '_blank')}
                                        className="w-full bg-red-600 text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm"
                                    >
                                        Reservar
                                        <ArrowRight className="w-3 h-3 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}
