'use client'; // Indica que este componente es ejecutado y procesado  del lado del cliente

import { Bot, Edit, Trash2, GraduationCap, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Assistant } from '@/lib/types/assistant';
import { useAssistantStore } from '@/store/assistantStore';

interface AssistantCardProps {
    assistant: Assistant;
    onDelete: (id: string) => void;
}

export const AssistantCard = ({ assistant, onDelete }: AssistantCardProps) => {
    const router = useRouter();
    const openEditModal = useAssistantStore(state => state.openEditModal);

    //Ir a la página de entrenamiento del asistente
    const handleTrain = () => {
        router.push(`/assistant/${assistant.id}`);
    };

    // Abrir modal de edición
    const handleEdit = () => {
        openEditModal(assistant);
    };

    // Callback de eliminación del asistente
    const handleDelete = () => {
        onDelete(assistant.id);
    };

    return (
        <div className="bg-white rounded-lg border border-neutral-200 px-4 sm:px-6 py-4 sm:py-5 min-h-[92px]
                    hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-[1px]">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base sm:text-lg text-neutral-900 truncate">
                            {assistant.name}
                        </h3>
                        {assistant.audioEnabled && (
                            <div className="flex items-center gap-1 text-xs text-primary-600 mt-1">
                                <Volume2 className="w-3 h-3 flex-shrink-0" />
                                <span className="hidden sm:inline">Audio habilitado</span>
                                <span className="sm:hidden">Audio</span>
                            </div>
                        )}
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

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={handleTrain}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-all duration-200 ease-out active:scale-[0.98]"
                        aria-label="Entrenar"
                    >
                        <GraduationCap className="w-5 h-5 text-neutral-700" />
                    </button>

                    <button
                        onClick={handleEdit}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-all duration-200 ease-out active:scale-[0.98]"
                        aria-label="Editar"
                    >
                        <Edit className="w-5 h-5 text-neutral-700" />
                    </button>

                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg hover:bg-danger-50 transition-all duration-200 ease-out active:scale-[0.98]"
                        aria-label="Eliminar"
                    >
                        <Trash2 className="w-5 h-5 text-danger-600" />
                    </button>
                </div>
            </div>

            {/* Información del asistente */}
            <div className="mt-3 pt-3 border-t border-neutral-100">
                <p className="text-xs text-neutral-600 mb-2">Longitud de respuestas:</p>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                            <div
                                className="bg-success-500 transition-all duration-300"
                                style={{ width: `${assistant.responseLength.short}%` }}
                            />
                            <div
                                className="bg-warning-500 transition-all duration-300"
                                style={{ width: `${assistant.responseLength.medium}%` }}
                            />
                            <div
                                className="bg-primary-500 transition-all duration-300"
                                style={{ width: `${assistant.responseLength.long}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-success-500 rounded-sm flex-shrink-0" />
                        <span className="text-neutral-600 whitespace-nowrap">Cortas {assistant.responseLength.short}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-warning-500 rounded-sm flex-shrink-0" />
                        <span className="text-neutral-600 whitespace-nowrap">Medias {assistant.responseLength.medium}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary-500 rounded-sm flex-shrink-0" />
                        <span className="text-neutral-600 whitespace-nowrap">Largas {assistant.responseLength.long}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};