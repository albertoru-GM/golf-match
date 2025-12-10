'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Menu, X, User, LogOut, Trophy, Calendar } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.user_metadata?.full_name) {
                setUserName(session.user.user_metadata.full_name);
            } else if (session?.user?.email) {
                setUserName(session.user.email.split('@')[0]);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.user_metadata?.full_name) {
                setUserName(session.user.user_metadata.full_name);
            } else if (session?.user?.email) {
                setUserName(session.user.email.split('@')[0]);
            } else {
                setUserName(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
        setIsMenuOpen(false);
    };

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-[var(--golf-green)] rounded-full flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
                            ⛳
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            GolfMatch
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {session ? (
                            <>
                                <Link
                                    href="/courses"
                                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${isActive('/courses')
                                            ? 'text-[var(--golf-green)]'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-[var(--golf-green)]'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Reservar</span>
                                </Link>
                                <Link
                                    href="/stats"
                                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${isActive('/stats')
                                            ? 'text-[var(--golf-green)]'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-[var(--golf-green)]'
                                        }`}
                                >
                                    <Trophy className="w-4 h-4" />
                                    <span>Estadísticas</span>
                                </Link>

                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                                <div className="flex items-center space-x-4">
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-2 text-sm font-medium text-gray-900 dark:text-white hover:text-[var(--golf-green)] transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <span>{userName}</span>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                        title="Cerrar sesión"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[var(--golf-green)] transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/login?signup=true"
                                    className="px-4 py-2 bg-[var(--golf-green)] text-white text-sm font-bold rounded-lg hover:bg-[var(--golf-green-dark)] transition-colors shadow-md hover:shadow-lg"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-2 pb-6 shadow-xl">
                    <div className="space-y-4 mt-4">
                        {session ? (
                            <>
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
                                        <User className="w-5 h-5 text-[var(--golf-green)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hola,</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{userName}</p>
                                    </div>
                                </div>

                                <Link
                                    href="/courses"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[var(--golf-green)] transition-colors"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium">Reservar Campo</span>
                                </Link>
                                <Link
                                    href="/stats"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[var(--golf-green)] transition-colors"
                                >
                                    <Trophy className="w-5 h-5" />
                                    <span className="font-medium">Mis Estadísticas</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[var(--golf-green)] transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Mi Perfil</span>
                                </Link>

                                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/login?signup=true"
                                    className="block w-full text-center px-4 py-3 rounded-xl bg-[var(--golf-green)] text-white font-bold hover:bg-[var(--golf-green-dark)] transition-colors shadow-md"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
