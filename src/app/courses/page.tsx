'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, MapPin } from 'lucide-react';
import CourseCard from '@/components/golf/CourseCard';
import CourseMap from '@/components/golf/CourseMap';
import { supabase } from '@/lib/supabase';
import { Course } from '@/types';

import { mockCourses } from '@/lib/mockCourses';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        // Fetch User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Geolocation access denied:', error);
                }
            );
        }

        // STRATEGY CHANGE: Use Exclusive Mock Data
        // The database contains inconsistent data (images, links). 
        // For the best user experience, we will strictly use the curated 'mockCourses' 
        // which have verified local images and deep booking links.
        setCourses(mockCourses);
        setLoading(false);

    }, []);

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            {/* Header */}
            <header className="bg-[var(--golf-green)] text-white pt-12 pb-24 px-4 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">Explora Campos</h1>
                    <p className="text-green-100">Encuentra y reserva en los mejores campos de España</p>
                </div>
            </header>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o ciudad..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-[var(--golf-green)] outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-4xl mx-auto px-4 mt-8">
                <CourseMap courses={filteredCourses} userLocation={userLocation} />
            </div>

            {/* Courses Grid */}
            <div className="max-w-4xl mx-auto px-4 mt-12">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campos Recomendados</h2>
                    <span className="text-sm text-gray-500">{filteredCourses.length} resultados</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[var(--golf-green)]" />
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} {...course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No se encontraron campos.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
