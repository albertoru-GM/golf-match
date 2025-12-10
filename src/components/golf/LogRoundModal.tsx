'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Calendar, Trophy, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Course } from '@/types';

interface LogRoundModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function LogRoundModal({ onClose, onSuccess }: LogRoundModalProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [score, setScore] = useState('');
    const [stableford, setStableford] = useState('');
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetchingCourses, setFetchingCourses] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .order('name');

                if (error) throw error;
                setCourses(data || []);
                if (data && data.length > 0) {
                    setSelectedCourseId(data[0].id);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setFetchingCourses(false);
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId || !date || !score) {
            setError('Por favor completa los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('Debes iniciar sesión para guardar estadísticas');
            }

            const { error: insertError } = await supabase
                .from('rounds')
                .insert({
                    user_id: user.id,
                    course_id: selectedCourseId,
                    date,
                    score: parseInt(score),
                    stableford_points: stableford ? parseInt(stableford) : null,
                    notes: notes || null
                });

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Error al guardar la ronda');
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Ronda Guardada!</h2>
                    <p className="text-gray-500 dark:text-gray-400">Tus estadísticas han sido actualizadas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[var(--golf-green)] p-6 relative flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-white">Registrar Ronda</h2>
                    <p className="text-green-100 text-sm mt-1">Guarda tus resultados y sigue tu progreso</p>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Course Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Campo</label>
                            {fetchingCourses ? (
                                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                            ) : (
                                <select
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--golf-green)] outline-none"
                                    required
                                >
                                    <option value="" disabled>Selecciona un campo</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

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
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--golf-green)] outline-none"
                                required
                            />
                        </div>

                        {/* Score & Stableford */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                    <Trophy className="w-4 h-4 mr-2 text-[var(--golf-green)]" />
                                    Golpes (Gross)
                                </label>
                                <input
                                    type="number"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    placeholder="Ej: 85"
                                    min="1"
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--golf-green)] outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Puntos Stableford
                                </label>
                                <input
                                    type="number"
                                    value={stableford}
                                    onChange={(e) => setStableford(e.target.value)}
                                    placeholder="Ej: 36"
                                    min="0"
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--golf-green)] outline-none"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-[var(--golf-green)]" />
                                Notas
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Comentarios sobre la ronda..."
                                rows={3}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--golf-green)] outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--golf-green)] hover:bg-[var(--golf-green-dark)] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Guardar Ronda'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
