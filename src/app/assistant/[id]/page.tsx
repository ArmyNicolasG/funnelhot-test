'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Bot, X } from 'lucide-react';
import { getAssistantById, updateAssistant } from '@/lib/services/assistantService';
import { ChatSimulator } from '@/components/ChatSimulator';
import { MessageDialog } from '@/components/MessageDialog';
import { useAssistantStore } from '@/store/assistantStore';

interface TrainingPageProps {
    params: {
        id: string;
    };
}

export default function TrainingPage({ params }: TrainingPageProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Estado local para las reglas de entrenamiento
    const [rules, setRules] = useState('');

    const { trainingTipsOpen, openTrainingTips, closeTrainingTips } = useAssistantStore();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogVariant, setDialogVariant] = useState<'success' | 'error' | 'info'>('info');

    const {
        data: assistant,
        isLoading,
        error
    } = useQuery({
        queryKey: ['assistant', params.id],
        queryFn: () => getAssistantById(params.id),
    });

    useEffect(() => {
        setRules(assistant?.rules || '');
    }, [assistant?.rules]);

    useEffect(() => {
        openTrainingTips();
    }, [params.id, openTrainingTips]);

    useEffect(() => {
        openTrainingTips();
    }, [params.id, openTrainingTips]);

    const saveMutation = useMutation({
        mutationFn: (newRules: string) => updateAssistant({
            id: params.id,
            rules: newRules
        }),
        onSuccess: () => {
            // Invalida ambas queries para mantener sincronización
            queryClient.invalidateQueries({ queryKey: ['assistant', params.id] });
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
            setDialogVariant('success');
            setDialogMessage('Entrenamiento guardado exitosamente');
            setDialogOpen(true);
        },
        onError: (error: Error) => {
            setDialogVariant('error');
            setDialogMessage(`Error al guardar: ${error.message}`);
            setDialogOpen(true);
        }
    });

    const handleSave = () => {
        saveMutation.mutate(rules);
    };

    const handleGoBack = () => {
        router.push('/');
    };

    // Estado de carga
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center px-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600 text-sm sm:text-base">Cargando asistente...</p>
                </div>
            </div>
        );
    }

    // Estado de error (asistente no encontrado)
    if (error || !assistant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center px-4">
                    <p className="text-danger-600 mb-4 text-sm sm:text-base">
                        Asistente no encontrado
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                       transition-colors text-sm sm:text-base shadow-sm"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <MessageDialog
                isOpen={dialogOpen}
                title={dialogVariant === 'success' ? 'Listo' : dialogVariant === 'error' ? 'Error' : 'Mensaje'}
                message={dialogMessage}
                variant={dialogVariant}
                onClose={() => setDialogOpen(false)}
            />
            <header className="bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Botón volver */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 
                       mb-4 transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        Volver a asistentes
                    </button>

                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-lg 
                            flex items-center justify-center flex-shrink-0">
                            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 truncate">
                                {assistant.name}
                            </h1>
                            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-neutral-600">
                                <span>
                                    Idioma: <strong className="text-neutral-900">{assistant.language}</strong>
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span>
                                    Tono: <strong className="text-neutral-900">{assistant.tone}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal  */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:items-stretch">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6 shadow-sm flex flex-col h-[500px] sm:h-[600px]">
                            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4">
                                Entrenamiento
                            </h2>

                            <p className="text-xs sm:text-sm text-neutral-600 mb-4">
                                Define las reglas y comportamiento del asistente. Estas
                                instrucciones guiarán sus respuestas en las conversaciones.
                            </p>

                            <textarea
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                placeholder="Ej: Eres un asistente especializado en ventas. Siempre sé cordial..."
                                className="w-full flex-1 min-h-0 px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 
                           rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           resize-none font-mono text-xs sm:text-sm transition-shadow"
                            />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center 
                              justify-between gap-3 mt-3">
                                <span className="text-xs text-neutral-500">
                                    {rules.length} caracteres
                                </span>

                                <button
                                    onClick={handleSave}
                                    disabled={saveMutation.isPending}
                                    className="flex items-center justify-center gap-2 px-4 py-2 
                             bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                             transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                             text-sm sm:text-base shadow-sm w-full sm:w-auto font-medium"
                                >
                                    {saveMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {trainingTipsOpen && (
                            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100 relative">
                                <button
                                    onClick={closeTrainingTips}
                                    className="absolute right-3 top-3 text-primary-700 hover:text-primary-900 rounded-lg p-1.5 hover:bg-primary-100 transition-all duration-200 ease-out active:scale-[0.98]"
                                    aria-label="Cerrar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <h3 className="font-medium text-primary-900 mb-2 text-sm sm:text-base 
                             flex items-center gap-2">
                                    <span>💡</span>
                                    Consejos para un buen entrenamiento
                                </h3>
                                <ul className="text-xs sm:text-sm text-primary-800 space-y-1.5">
                                    <li>• Define claramente el propósito del asistente</li>
                                    <li>• Especifica el tono y estilo de comunicación</li>
                                    <li>• Indica qué debe hacer y qué no debe hacer</li>
                                    <li>• Proporciona ejemplos de respuestas deseadas</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <ChatSimulator assistant={assistant} />
                    </div>

                </div>
            </main>
        </div>
    );
}