import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { Course } from '@/types';

export default function CourseCard({ id, name, location, image_url, rating }: Course) {
    return (
        <Link href={`/courses/${id}`} className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="relative h-48 w-full">
                <Image
                    src={image_url || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop'}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{rating}</span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{name}</h3>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {location}
                </div>
            </div>
        </Link>
    );
}
