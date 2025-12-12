'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Course } from '@/types';
import { MapPin, Star, ChevronLeft, Loader2 } from 'lucide-react';
import BookingModal from '@/components/golf/BookingModal';

import { mockCourses } from '@/lib/mockCourses';

interface CoursePageProps {
    params: {
        id: string;
    };
}

export default function CourseDetailPage({ params }: CoursePageProps) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            // Check if Supabase is configured
            const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url' &&
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!isSupabaseConfigured) {
                console.log('Supabase not configured, using mock data');
                const mockCourse = mockCourses.find(c => c.id === params.id);
                if (mockCourse) {
                    setCourse(mockCourse);
                }
                setLoading(false);
                return;
            }

            try {
                // Add a timeout promise to prevent infinite hanging
                const fetchPromise = supabase
                    .from('courses')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 2500)
                );

                const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

                if (error) throw error;

                // Merge with mock data if needed
                const mockCourse = mockCourses.find(c => c.name === data.name);
                const mergedCourse = {
                    ...data,
                    booking_url: data.booking_url || mockCourse?.booking_url
                };

                setCourse(mergedCourse);
            } catch (error) {
                console.error('Error fetching course:', error);
                const mockCourse = mockCourses.find(c => c.id === params.id);
                if (mockCourse) {
                    setCourse(mockCourse);
                }
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCourse();
        }
    }, [params.id]);

    const handleBooking = () => {
        if (course?.booking_url) {
            window.open(course.booking_url, '_blank');
        } else {
            alert('Enlace de reserva no disponible. Por favor contacta con el club directamente.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--golf-green)]" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
                <p className="text-gray-500 mb-4">Campo no encontrado</p>
                <Link href="/courses" className="text-[var(--golf-green)] hover:underline">
                    Volver a campos
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black pb-24">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 w-full">
                <Image
                    src={course.image_url || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop'}
                    alt={course.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <Link
                    href="/courses"
                    className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-xl min-h-[calc(100vh-14rem)]">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h1>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{course.location}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                                <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                                <span className="font-bold text-yellow-700 dark:text-yellow-400">{course.rating}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8 border-y border-gray-100 dark:border-gray-800 py-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--golf-green)]">{course.holes || 18}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Hoyos</div>
                        </div>
                        <div className="text-center border-l border-gray-100 dark:border-gray-800">
                            <div className="text-2xl font-bold text-[var(--golf-green)]">{course.par || 72}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Par</div>
                        </div>
                        <div className="text-center border-l border-gray-100 dark:border-gray-800">
                            <div className="text-2xl font-bold text-[var(--golf-green)]">128</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Slope</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Sobre el campo</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {course.description || 'Disfruta de una experiencia única en uno de los mejores campos de la región. Diseñado para desafiar a jugadores de todos los niveles.'}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="mb-24">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Servicios</h2>
                        <div className="flex flex-wrap gap-3">
                            {(course.amenities || ['Driving Range', 'Pro Shop', 'Restaurante', 'Buggy', 'Alquiler de Palos']).map((item: string) => (
                                <span
                                    key={item}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg z-20">
                <div className="container mx-auto flex items-center justify-between max-w-lg">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Precio desde</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">65€</span>
                    </div>
                    <button
                        onClick={handleBooking}
                        className="bg-[var(--golf-green)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[var(--golf-green-dark)] transition-colors transform active:scale-95 flex items-center"
                    >
                        Reservar (Web del Club)
                        <Star className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </main>
    );
}
