'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Calendar, Clock, Users, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
    courseId: string;
    courseName: string;
    price: number;
    onClose: () => void;
}

export default function BookingModal({ courseId, courseName, price, onClose }: BookingModalProps) {
    const router = useRouter();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [players, setPlayers] = useState(2);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBooking = async () => {
        if (!date || !time) {
            setError('Por favor selecciona fecha y hora');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Debes iniciar sesión para reservar');
            }

            const { error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    course_id: courseId,
                    date,
                    time,
                    players,
                    status: 'confirmed', // Auto-confirm for demo
                });

            if (bookingError) throw bookingError;

            setSuccess(true);
            setTimeout(() => {
                onClose();
                router.push('/profile'); // Redirect to profile to see booking
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Error al procesar la reserva');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-[var(--golf-green)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Reserva Confirmada!</h2>
                    <p className="text-gray-500 dark:text-gray-400">Tu tee time en {courseName} ha sido reservado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[var(--golf-green)] p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-white pr-8">Reservar Tee Time</h2>
                    <p className="text-green-100 text-sm mt-1">{courseName}</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Date Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-[var(--golf-green)]" />
                            Fecha
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--golf-green)] outline-none"
                        />
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-[var(--golf-green)]" />
                            Hora
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${time === t
                                            ? 'bg-[var(--golf-green)] text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Players Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Users className="w-4 h-4 mr-2 text-[var(--golf-green)]" />
                            Jugadores
                        </label>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                            <button
                                onClick={() => setPlayers(Math.max(1, players - 1))}
                                className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[var(--golf-green)]"
                            >
                                -
                            </button>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">{players}</span>
                            <button
                                onClick={() => setPlayers(Math.min(4, players + 1))}
                                className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[var(--golf-green)]"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">Total estimado</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{price * players}€</span>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={loading}
                        className="w-full bg-[var(--golf-green)] hover:bg-[var(--golf-green-dark)] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Confirmar Reserva'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
