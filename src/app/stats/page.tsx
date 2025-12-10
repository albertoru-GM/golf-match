'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, Activity, Calendar, Trophy, Plus, Loader2 } from 'lucide-react';
import { Round } from '@/types';
import LogRoundModal from '@/components/golf/LogRoundModal';

export default function StatsPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLogModal, setShowLogModal] = useState(false);
    const [stats, setStats] = useState({
        handicap: 0,
        averageScore: 0,
        bestScore: 0,
        roundsPlayed: 0
    });

    const fetchRounds = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('rounds')
                .select(`
                    *,
                    course:courses(name, par)
                `)
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;

            const fetchedRounds = data || [];
            setRounds(fetchedRounds);
            calculateStats(fetchedRounds);

        } catch (error) {
            console.error('Error fetching rounds:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (roundsData: any[]) => {
        if (roundsData.length === 0) return;

        const scores = roundsData.map(r => r.score);
        const bestScore = Math.min(...scores);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        // Simple handicap calculation for demo (average over par)
        // In a real app, this would be a complex WHS calculation
        const totalOverPar = roundsData.reduce((acc, r) => {
            const par = r.course?.par || 72;
            return acc + (r.score - par);
        }, 0);
        const handicap = parseFloat((totalOverPar / roundsData.length).toFixed(1));

        setStats({
            handicap: Math.max(0, handicap),
            averageScore,
            bestScore,
            roundsPlayed: roundsData.length
        });
    };

    useEffect(() => {
        fetchRounds();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Estadísticas</h1>
                    <button
                        onClick={() => setShowLogModal(true)}
                        className="bg-[var(--golf-green)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--golf-green-dark)] transition-colors"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[var(--golf-green)]" />
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Handicap Est.</span>
                                    <Activity className="w-5 h-5 text-[var(--golf-green)]" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.handicap}</div>
                                <div className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingDown className="w-3 h-3 mr-1" /> Calculado
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Media Golpes</span>
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageScore}</div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Mejor Vuelta</span>
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.bestScore}</div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Rondas</span>
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.roundsPlayed}</div>
                            </div>
                        </div>

                        {/* Recent Rounds List */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Últimas Rondas</h2>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {rounds.length > 0 ? (
                                    rounds.map((round: any) => (
                                        <div key={round.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{round.course?.name || 'Campo desconocido'}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(round.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center space-x-6">
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-400 uppercase">Score</div>
                                                        <div className={`text-xl font-bold ${round.score <= (round.course?.par || 72) ? 'text-[var(--golf-green)]' : 'text-gray-900 dark:text-white'}`}>
                                                            {round.score}
                                                        </div>
                                                    </div>
                                                    {round.stableford_points && (
                                                        <div className="text-center hidden sm:block">
                                                            <div className="text-xs text-gray-400 uppercase">Stb</div>
                                                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{round.stableford_points}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay rondas registradas. ¡Juega y registra tu primera ronda!
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showLogModal && (
                <LogRoundModal
                    onClose={() => setShowLogModal(false)}
                    onSuccess={fetchRounds}
                />
            )}
        </main>
    );
}
