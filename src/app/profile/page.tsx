'use client';

import { supabase } from '@/lib/supabase';
import Rating from '@/components/golf/Rating';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [rating, setRating] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            // Check if Supabase is configured
            const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url' &&
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!isSupabaseConfigured) {
                // Demo Mode: Set mock user
                setUser({
                    id: 'demo-user',
                    email: 'demo@golfmatch.com',
                    full_name: 'Demo User',
                    handicap: 18.5,
                    golf_rating: 7.2
                });
                setRating(7.2);
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }

            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData?.user) {
                console.error('Error fetching user:', authError);
                router.push('/login');
                return;
            }

            const user = authData.user;

            // Fetch profile data from 'profiles' table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            }

            // Merge auth user with profile data
            setUser({
                ...user,
                ...profileData
            });

            setRating(profileData?.golf_rating ?? 0);
            setLoading(false);
        };

        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--golf-green)]" />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
            <section className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-100 dark:border-gray-800 relative">
                <button
                    onClick={handleSignOut}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Cerrar Sesión"
                >
                    <LogOut className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-20 h-20 bg-[var(--golf-green)] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {(user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil de Golfista</h1>
                        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <strong className="text-gray-900 dark:text-white text-lg">Golf Rating</strong>
                                <span className="text-2xl font-bold text-[var(--golf-green)]">{rating}</span>
                            </div>
                            <Rating value={rating} max={10} />
                            <p className="text-sm text-gray-500 mt-2">Nivel Avanzado</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-1">
                                <strong className="text-gray-900 dark:text-white text-lg">Handicap</strong>
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {user.handicap ?? 'N/A'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">World Handicap System</p>
                        </div>
                    </div>

                    {/* Next Booking */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Próxima Reserva</h2>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg text-yellow-700 dark:text-yellow-400 font-bold text-center min-w-[60px]">
                                <span className="block text-xs uppercase">OCT</span>
                                <span className="text-xl">24</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Real Club de Golf El Prat</h3>
                                <p className="text-sm text-gray-500">09:30 • 2 Jugadores</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actividad Reciente</h2>
                        <div className="space-y-3">
                            {[
                                { course: 'Golf Santander', date: '15 Oct', score: 82, points: 36 },
                                { course: 'Valderrama Golf', date: '08 Oct', score: 88, points: 32 },
                                { course: 'Club de Campo', date: '01 Oct', score: 79, points: 39 },
                            ].map((round, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{round.course}</p>
                                        <p className="text-xs text-gray-500">{round.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-gray-900 dark:text-white">{round.score} golpes</span>
                                        <span className="text-xs text-[var(--golf-green)] font-medium">{round.points} pts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
